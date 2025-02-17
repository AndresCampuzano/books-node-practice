import { Router } from 'express';

import { validatePartialMovie } from '../schemas/movies.js';
import { MovieModel } from "../models/movie.js";
import {MovieController} from "../controllers/movies.js";

export const moviesRouter = Router();

/**
 * get all movies with optional query parameters
 */
moviesRouter.get('/', MovieController.getAll);

/**
 * get movie by id
 */
moviesRouter.get('/:id', MovieController.getById);

/**
 * create movie
 */
moviesRouter.post('/', MovieController.create);

/**
 * update partially a movie
 */
moviesRouter.patch('/:id', MovieController.update);

/**
 * delete a movie
 */
moviesRouter.delete('/:id', MovieController.delete);
