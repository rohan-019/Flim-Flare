import express from 'express'
import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/show.js';
import adminAuth from '../middleswares/adminAuth.js';
import { search } from '../controllers/Search.js';

const showRouter=express.Router();

showRouter.get('/now-playing',adminAuth,getNowPlayingMovies);
showRouter.post('/add',adminAuth,addShow);
showRouter.get('/all',getShows);
showRouter.get('/:movieId',getShow);
showRouter.post('/search',search);

export default showRouter;