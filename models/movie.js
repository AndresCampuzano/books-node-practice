import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    ssl: {
        rejectUnauthorized: false
    }
});

export class MovieModel {
    static async getAll({ genre, search }) {
        let query = `
            SELECT m.id,
                   m.title,
                   m.year,
                   m.director,
                   m.duration,
                   m.poster,
                   m.rate,
                   array_agg(g.name) AS genres
            FROM movie m
                     JOIN movie_genres mg ON m.id = mg.movie_id
                     JOIN genre g ON mg.genre_id = g.id
        `;

        const queryParams = [];
        const conditions = [];

        if (genre) {
            queryParams.push(`%${genre}%`);
            conditions.push(`m.id IN (
            SELECT m.id
            FROM movie m
            JOIN movie_genres mg ON m.id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.id
            WHERE g.name ILIKE $${queryParams.length}
        )`);
        }

        if (search) {
            queryParams.push(`%${search}%`, `%${search}%`);
            conditions.push(`(m.title ILIKE $${queryParams.length - 1} OR m.director ILIKE $${queryParams.length})`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` GROUP BY m.id`;

        const { rows } = await pool.query(query, queryParams);
        return rows;
    }

    static async getById({ id }) {
        const { rows } = await pool.query(`
            SELECT m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate, array_agg(g.name) AS genres
            FROM movie m
            JOIN movie_genres mg ON m.id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.id
            WHERE m.id = $1
            GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate;
        `, [id]);

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    }

    static async create({ movie }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert movie
            const { rows } = await client.query(`
                INSERT INTO movie (title, year, director, duration, poster, rate)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `, [movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate]);

            const movieId = rows[0].id;

            // Insert genres
            for (const genre of movie.genre) {
                const genreResult = await client.query(`
                    SELECT id FROM genre WHERE name = $1;
                `, [genre]);

                if (genreResult.rows.length === 0) {
                    throw new Error(`Genre '${genre}' does not exist`);
                }

                const genreId = genreResult.rows[0].id;

                // Insert movie_genres
                await client.query(`
                    INSERT INTO movie_genres (movie_id, genre_id)
                    VALUES ($1, $2);
                `, [movieId, genreId]);
            }

            await client.query('COMMIT');

            return { id: movieId };
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Error creating movie');
        } finally {
            client.release();
        }
    }

    static async update({ id, partialMovie }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query(`
                SELECT * FROM movie WHERE id = $1;
            `, [id]);

            if (rows.length === 0) {
                throw new Error('Movie not found');
            }

            const movie = rows[0];

            const movieUpdate = {
                title: partialMovie.title ?? movie.title,
                year: partialMovie.year ?? movie.year,
                director: partialMovie.director ?? movie.director,
                duration: partialMovie.duration ?? movie.duration,
                poster: partialMovie.poster ?? movie.poster,
                rate: partialMovie.rate ?? movie.rate
            };

            await client.query(`
                UPDATE movie
                SET title = $1, year = $2, director = $3, duration = $4, poster = $5, rate = $6
                WHERE id = $7;
            `, [movieUpdate.title, movieUpdate.year, movieUpdate.director, movieUpdate.duration, movieUpdate.poster, movieUpdate.rate, id]);

            if (partialMovie.genre) {
                await client.query(`
                    DELETE FROM movie_genres WHERE movie_id = $1;
                `, [id]);

                for (const genre of partialMovie.genre) {
                    const genreResult = await client.query(`
                        SELECT id FROM genre WHERE name = $1;
                    `, [genre]);

                    if (genreResult.rows.length === 0) {
                        throw new Error(`Genre '${genre}' does not exist`);
                    }

                    const genreId = genreResult.rows[0].id;

                    // Insert movie_genres
                    await client.query(`
                        INSERT INTO movie_genres (movie_id, genre_id)
                        VALUES ($1, $2);
                    `, [id, genreId]);
                }
            }

            await client.query('COMMIT');

            return { id };
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Error updating movie');
        } finally {
            client.release();
        }
    }

    static async delete({ id }) {
        const { rows } = await pool.query(`
            DELETE FROM movie
            WHERE id = $1
            RETURNING id;
        `, [id]);

        return rows[0];
    }
}
