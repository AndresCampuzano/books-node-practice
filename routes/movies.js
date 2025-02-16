import { Router } from 'express';

import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import { readJSON } from "../utils.js";
import { MovieModel } from "../models /movie.js";

const moviesData = readJSON('./data/movies.json');

export const moviesRouter = Router();

/**
 * get all movies with optional query parameters
 */
moviesRouter.get('/', async (req, res) => {
    const { genre, search } = req.query;

    try {
        const result = await MovieModel.getAll({ genre, search });
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * get movie by id
 */
moviesRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await MovieModel.getById({ id });
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * create movie
 */
moviesRouter.post('/', async (req, res) => {
    const validation = validateMovie(req.body);

    if (validation.error) {
        return res.status(400).json({ message: JSON.parse(validation.error.message) });
    }
    try {
        const result = await MovieModel.create({ movie: validation.data });
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: JSON.parse(error.message) });
    }
});

/**
 * update partially a movie
 */
moviesRouter.patch('/:id', async (req, res) => {
    const id = req.params.id;

    const validation = validatePartialMovie(req.body);

    if (validation.error) {
        return res.status(400).json({ message: JSON.parse(validation.error.message) });
    }

    try {
        const result = await MovieModel.update({ id, partialMovie: validation.data });
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: JSON.parse(error.message) });
    }
});

/**
 * delete a movie
 */
moviesRouter.delete('/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const result = await MovieModel.delete({ id });
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
