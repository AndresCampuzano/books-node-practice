import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
    static async getAll(req, res) {
        const { genre, search } = req.query;
        const result = await MovieModel.getAll({ genre, search });
        res.json(result);
    }

    static async getById(req, res) {
        const id = req.params.id;
        const result = await MovieModel.getById({ id });
        if (result) {
            return res.json(result);
        }
        res.status(404).json({ message: 'Movie not found' });
    }

    static async create(req, res) {
        const validation = validateMovie(req.body);
        if (validation.error) {
            return res.status(400).json({ message: JSON.parse(validation.error.message) });
        }
        const result = await MovieModel.create({ movie: validation.data });
        res.status(201).json(result);
    }

    static async update(req, res) {
        const id = req.params.id;
        const validation = validatePartialMovie(req.body);

        if (validation.error) {
            return res.status(400).json({ message: JSON.parse(validation.error.message) });
        }

        const result = await MovieModel.update({ id, partialMovie: validation.data });
        res.json(result);
    }

    static async delete(req, res) {
        const id = req.params.id;
        const result = await MovieModel.delete({ id });
        res.json(result);
    }
}