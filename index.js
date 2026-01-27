import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';

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

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    const data = { message: 'Welcome to the Express server!' };
    res.json(data);
});

import uploadRoute from './src/routes/image.route.js';

app.use('/api/v1/upload', uploadRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});