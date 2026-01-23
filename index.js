import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import { createUploader } from './middleware/upload.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://cdnjs.cloudflare.com",
                ],
                connectSrc: [
                    "'self'",
                    "ws:",
                    "wss:",
                ],
            },
        },
    })(req, res, next);
});

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = createUploader('images');

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', file: req.file });
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    const data = { message: 'Welcome to the Express server!' };
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});