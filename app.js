import express from 'express';
import cors from 'cors';
import {moviesRouter} from "./routes/movies.js";

const app = express();

app.disable('x-powered-by');
app.use(cors()); // FIXME: allow only specific origins
app.use(express.json());

app.use('/movies', moviesRouter);


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});