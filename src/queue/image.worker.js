import { Queue, Worker } from "bullmq";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import IORedis from "ioredis";

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const REDIS_URL = process.env.REDIS_URL;

if(!REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
}

const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

const BASEDIR = process.cwd();
const UPLOADS_DIR = path.join(BASEDIR, 'uploads');
const CONVERTED_DIR = path.join(UPLOADS_DIR, 'converted');

ensureDir(UPLOADS_DIR);
ensureDir(CONVERTED_DIR);

// Image processing configurations
const IMAGE_VERSIONS = [
    { name: 'thumbnail', width: 150, quality: 60 },
    { name: 'small', width: 400, quality: 70 },
    { name: 'medium', width: 800, quality: 80 },
    { name: 'large', width: 1200, quality: 85 },
    { name: 'original', width: null, quality: 90 } // null means keep original size
];

const worker = new Worker("image-processing", async (job) => {
    if (job.name === "process-image") {
        const { imagePath } = job.data;

        const inputPath = path.join(UPLOADS_DIR, imagePath);

        // Check if file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error(`File not found: ${inputPath}`);
        }

        const baseName = path.parse(imagePath).name;
        const outputBaseDir = path.join(CONVERTED_DIR, baseName);
        ensureDir(outputBaseDir);

        const processedImages = {};
        const metadata = await sharp(inputPath).metadata();
        // Process each version
        for (const version of IMAGE_VERSIONS) {
            const outputPath = path.join(outputBaseDir, `${version.name}.webp`);

            let sharpInstance = sharp(inputPath);

            // Resize maintaining aspect ratio
            if (version.width && version.width < metadata.width) {
                sharpInstance = sharpInstance.resize(version.width, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }

            // Convert to WebP with specified quality
            await sharpInstance
                .webp({ quality: version.quality })
                .toFile(outputPath);

            processedImages[version.name] = {
                path: outputPath,
                quality: version.quality,
                width: version.width || metadata.width
            };
        }

        return {
            originalPath: inputPath,
            baseFolder: outputBaseDir,
            versions: processedImages,
            totalVersions: IMAGE_VERSIONS.length
        };
    } else {
        throw new Error(`Unknown job name: ${job.name}`);
    }
}, {
    connection
});

worker.on("completed", (job, returnvalue) => {
    console.log(`Job ${job.id} completed with total versions:`, returnvalue.totalVersions);
});

const dlq = new Queue('image-processing-dlq', {
    connection
});

worker.on("failed", (job, err) => {

    if (job.attemptsMade >= job.opts.attempts) {
        dlq.add('failed-job', {
            originalJobId: job.id,
            name: job.name,
            data: job.data,
            failedReason: err.message,
            attemptsMade: job.attemptsMade,
            timestamp: Date.now()
        });
    }

    console.error(`Job ${job.id} failed with error:`, err);
});
