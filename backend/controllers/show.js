import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/show.js";
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNRESET';
    },
});

//get all movies from TMDB 
export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            timeout: 5000
        });
        const movies = data.results;
        res.json({
            success: true,
            movies: movies
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//add shows (only for admin)
export const addShow = async (req, res) => {
    try {
        const { movieId, dateTime, price } = req.body;
        // console.log(movieId,dateTime,price);

        if (!movieId || !dateTime || !price) {
            return res.json({
                success: false,
                message: 'All Details are required'
            })
        }
        let movie = await Movie.findById(movieId);
        if (!movie) {
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                    timeout: 5000
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                    timeout: 5000
                })

            ])
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || '',
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
            }
            movie = await Movie.create(movieDetails);
        }
        const showsToCreate = [];
        dateTime.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: dateTimeString,
                    showPrice: price,
                    occupiedSeats: {}
                })
            })

        });
        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }
        res.json({ success: true, message: 'Show added successfully' });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//get all shows
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        const uniqueShows = new Set(shows.map(show => show.movie));
        res.json({
            success: true,
            shows: Array.from(uniqueShows)
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//get particular show
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });
        const movie = await Movie.findById(movieId);
        const dateTime = {};
        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id });
        });
        res.json({
            success: true,
            show: {
                dateTime,
                movie,
            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}