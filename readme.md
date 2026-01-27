# BullMQ With Sharp For Image Processing

Small program to see queue in action. I created this program to see how can we do heavy works efficiently without overloading the server.

## Features

- Uses [BullMQ](https://docs.bullmq.io/) for queue management
- Processes images using [Sharp](https://sharp.pixelplumbing.com/)
- Prevents server overload by offloading heavy tasks to background workers

## Getting Started

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Start Redis:**  
    Make sure you have a Redis server running locally or update the configuration to point to your Redis instance.
    `image.queue.js` and `image.worker.js`

    ```bash
        connection: {
            host: "localhost",
            port: 6379,
        },
    ```

3. **Run the application:**

    ```bash
    npm run dev
    ```

    and

    ```bash
    npm run worker
    ```

## Usage

- Send an image processing request to the API endpoint `http://localhost:8000/api/v1/upload`
- The image will be queued and processed in the background.
- Processed images are saved to the `uploads/converted` directory.

## Project Structure

- `src/queue/` - BullMQ queue and worker setup
- `src/middleware/` - Image upload middleware using multer 

