import { validate as isUUID } from 'uuid';
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
    constructor({movieModel}) {
        this.movieModel = movieModel
    }
    getAll = async (req, res) => {
        const { genre, search } = req.query;
        const result = await this.movieModel.getAll({ genre, search });
        res.json(result);
    }

    getById = async (req, res) => {
        const id = req.params.id;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const result = await this.movieModel.getById({ id });
        if (result) {
            return res.json(result);
        }
        res.status(404).json({ message: 'Movie not found' });
    }

    create = async (req, res) => {
        const validation = validateMovie(req.body);
        if (validation.error) {
            return res.status(400).json({ message: JSON.parse(validation.error.message) });
        }
        const result = await this.movieModel.create({ movie: validation.data });
        res.status(201).json(result);
    }

    update = async (req, res) => {
        const id = req.params.id;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const validation = validatePartialMovie(req.body);

        if (validation.error) {
            return res.status(400).json({ message: JSON.parse(validation.error.message) });
        }

        const result = await this.movieModel.update({ id, partialMovie: validation.data });
        res.json(result);
    }

    delete = async (req, res) => {
        const id = req.params.id;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const result = await this.movieModel.delete({ id });
        res.json(result);
    }
}