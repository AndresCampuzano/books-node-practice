import z from 'zod';

const movieSchema = z.object({
    title: z.string({
        required_error: 'title is required',
        invalid_type_error: 'title must be a string'
    }).min(1).max(200),
    year: z.number({
        required_error: 'year is required',
        invalid_type_error: 'year must be a number'
    }).min(1900, {
        message: 'year must be greater or equal than 1900'
    }).max(new Date().getFullYear(), {
        message: `year must be less or equal than ${new Date().getFullYear()}`
    }).int({
        message: 'year must be an integer'
    }),
    director: z.string().min(3).max(200),
    duration: z.number({
        required_error: 'duration is required',
        invalid_type_error: 'duration must be a number'
    }).positive({
        message: 'duration must be a positive number'
    }).int({
        message: 'duration must be an integer'
    }).max(500, {
        message: 'duration must be less or equal than 500'
    }),
    poster: z.string().url({
        message: 'poster must be a valid URL starting with https://'
    }),
    genre: z.array(
        z.enum(['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy']),
        {
            required_error: 'genre is required',
            invalid_type_error: 'genre must be an array of enum Genre'
        }
    ),
    rate: z.number().min(0).max(10).int().default(0)
});

export function validateMovie(ob) {
    return movieSchema.safeParse(ob)
}

export function validatePartialMovie(ob) {
    return movieSchema.partial().safeParse(ob)
}

