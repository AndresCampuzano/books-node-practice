import { createServer } from "../app.js";
import { MovieModel } from "../models/local-movie.js";

createServer({ movieModel: MovieModel });