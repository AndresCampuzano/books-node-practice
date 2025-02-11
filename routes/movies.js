import { Router } from 'express';
import { randomUUID } from 'node:crypto';

import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import { readJSON } from "../utils.js";

const moviesData = readJSON('./data/movies.json');

export const moviesRouter = Router();

/**
 * get all movies with optional query parameters
 */
moviesRouter.get('/', (req, res) => {
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
moviesRouter.get('/:id', (req, res) => {
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
moviesRouter.post('/', (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data,
    };

    res.status(201).json(newMovie);
});

/**
 * update partially a movie
 */
moviesRouter.patch('/:id', (req, res) => {
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
moviesRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    const movie = moviesData.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted' });
});
