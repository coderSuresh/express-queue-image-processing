import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if(!REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
}

const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

const queue = new Queue("image-processing", {
  connection
});

const addImageToQueue = async (imagePath) => {
  await queue.add(
    "process-image",
    { imagePath },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}

export { addImageToQueue };