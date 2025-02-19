import { Router } from 'express';
// import { MovieModel } from "../models/movie.js";
import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router();

    const movieController = new MovieController({ movieModel });

    /**
     * get all movies with optional query parameters
     */
    moviesRouter.get('/', movieController.getAll);

    /**
     * get movie by id
     */
    moviesRouter.get('/:id', movieController.getById);

    /**
     * create movie
     */
    moviesRouter.post('/', movieController.create);

    /**
     * update partially a movie
     */
    moviesRouter.patch('/:id', movieController.update);

    /**
     * delete a movie
     */
    moviesRouter.delete('/:id', movieController.delete);

    return moviesRouter;
};
