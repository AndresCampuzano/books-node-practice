import { randomUUID } from 'node:crypto';

import { readJSON } from "../utils.js";

const moviesData = readJSON('./data/movies.json');

export class MovieModel {
    static async getAll({ genre, search }) {
        if (genre) {
            return await moviesData.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        }
        if (search) {
            return await moviesData.filter(movie =>
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.director.toLowerCase().includes(search.toLowerCase()) ||
                movie.genre.join().toLowerCase().includes(search.toLowerCase())
            );
        }
        return moviesData;
    }

    static async getById({ id }) {
        const movie = await moviesData.find(movie => movie.id === id);

        if (!movie) {
            throw new Error('Movie not found');
        }

        return movie;
    }

    static async create({ movie }) {
        return {
            id: randomUUID(),
            ...movie,
        };
    }

    static async update({ id, partialMovie }) {
        const index = moviesData.findIndex(movie => movie.id === id);

        if (index === -1) {
            throw new Error('Movie not found');
        }

        moviesData[index] = {
            ...moviesData[index],
            ...partialMovie,
        };

        return moviesData[index];
    }

    static async delete({ id }) {
        const index = moviesData.findIndex(movie => movie.id === id);

        if (index === -1) {
            throw new Error('Movie not found');
        }

        moviesData.splice(index, 1);

        return { message: 'Movie deleted successfully' };
    }
}
