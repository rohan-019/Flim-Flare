import axios from "axios";
import main from "../services/aiService.js";

const api_key = 'ad9b626624981feb694911d90d8ba1b9';

const delay = (ms) => new Promise(res => setTimeout(res, ms));


const fetchMovies = async (query, retries = 3, delayMs = 500) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                include_adult: false,
                language: 'en-US',
                page: 1,
                api_key,
                query
            },
            timeout: 5000
        });

        if (data.results && data.results.length > 0) {
            return data.results[0];
        } else {
            return { title: query, error: 'No results found' };
        }
    } catch (err) {
        if (retries > 0) {
            console.warn(`Retrying ${query} due to error: ${err.message}`);
            await new Promise(res => setTimeout(res, delayMs));
            return fetchMovies(query, retries - 1, delayMs);
        }
        return { MovieName: query, error: err.message || 'Request failed' };
    }
};


export const search = async (req, res) => {
    try {
        const { prompt } = req.body;
        // console.log('Hii');
        
        const content = await main(
            `Recommend exactly 10 movies based on user prompt "${prompt}". Just names separated by commas. Nothing else.`
        );

        const arr = content.split(',').map(m => m.trim()).slice(0, 10);
        // console.log(arr);
        
        const results = [];

        for (const movie of arr) {
            const result = await fetchMovies(movie);
            const movieId=result.id;
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })

            ])
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            const userMovie = {
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


            // const userMovie={
            //     title: result.title,
            //     poster_path: result.poster_path,
            //     backdrop_path: result.backdrop_path,
            //     release_date: result.release_date,
            //     original_language: result.original_language,
            //     tagline: result.tagline || '',
            //     vote_average: result.vote_average,
            // }
            if(userMovie && userMovie.title && userMovie.poster_path && userMovie.backdrop_path && userMovie.release_date)results.push(userMovie);
            await delay(300);
        }

        // console.log(results);
        

        return res.json({
            success: true,
            movieTiltle:arr,
            movies: results
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
