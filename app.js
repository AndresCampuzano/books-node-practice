import express from 'express';
import crypto from 'node:crypto';
import cors from 'cors';

import { validateMovie, validatePartialMovie } from './movies.js';
import { readJSON } from "./utils.js";

const moviesData = readJSON('./movies.json');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

/**
 * general endpoint
 */
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

/**
 * get all movies with optional query parameters
 */
app.get('/movies', (req, res) => {
    const { genre, search } = req.query;

    if (genre) {
        const filteredMovies = moviesData.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    }

    if (search) {
        const filteredMovies = moviesData.filter(movie =>
            movie.title.toLowerCase().includes(search.toLowerCase()) ||
            movie.director.toLowerCase().includes(search.toLowerCase()) ||
            movie.genre.join().toLowerCase().includes(search.toLowerCase())
        );
        return res.json(filteredMovies);
    }
    res.json(moviesData);
});

/**
 * get movie by id
 */
app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = moviesData.find(movie => movie.id === id);
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
});

/**
 * create movie
 */
app.post('/movies', (req, res) => {

    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data,
    };

    res.status(201).json(newMovie);
});

/**
 * update partially a movie
 */
app.patch('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = moviesData.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const updatedMovie = {
        ...movie,
        ...result.data,
    };

    res.json(updatedMovie);
});

/**
 * delete a movie
 */
app.delete('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = moviesData.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted' });
});


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});