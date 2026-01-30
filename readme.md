# BullMQ With Sharp For Image Processing

Small program to see queue in action. I created this program to see how can we do heavy works efficiently without overloading the server.

## Features

- Uses [BullMQ](https://docs.bullmq.io/) for queue management
- Processes images using [Sharp](https://sharp.pixelplumbing.com/)
- Prevents server overload by offloading heavy tasks to background workers

## Getting Started

### Using Docker

1. **Build the Docker image:**

    ```bash
    docker build -t image-api .
    ```

2. **Start all services with Docker Compose:**

    ```bash
    docker-compose up
    ```

    This will start:
    - API server (port 8000)
    - Background worker
    - Redis server

3. **Stop services:**

    ```bash
    docker-compose down
    ```

## Usage

- Send an image processing request to the API endpoint `http://localhost:8000/api/v1/upload`
- The image will be queued and processed in the background.
- Processed images are saved to the `uploads/converted` directory.

## Project Structure

- `src/queue/` - BullMQ queue and worker setup
- `src/middleware/` - Image upload middleware using multer
