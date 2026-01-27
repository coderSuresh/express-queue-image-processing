import { Queue } from "bullmq";

const queue = new Queue("image-processing", {
  connection: {
    host: "localhost",
    port: 6379,
  },
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