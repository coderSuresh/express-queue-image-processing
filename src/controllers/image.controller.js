import { addImageToQueue } from "../queue/image.queue.js";

const pushToQueue = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
      
        const imagePath = req.file.path;
        await addImageToQueue(imagePath);

        res.status(200).json({ message: 'Image uploaded and processing started', imagePath });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { pushToQueue };