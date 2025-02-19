import { createServer } from "../app.js";
import { MovieModel } from "../models/movie.js";

createServer({ movieModel: MovieModel });