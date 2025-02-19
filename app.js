import express from 'express';
import cors from 'cors';
import { createMovieRouter } from "./routes/movies.js";
import 'dotenv/config';

export const createServer = ({ movieModel }) => {
    const app = express();

    app.disable('x-powered-by');
    app.use(cors());
    app.use(express.json());

    app.use('/movies', createMovieRouter({ movieModel }));

    const PORT = process.env.PORT ?? 1234;

    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}
