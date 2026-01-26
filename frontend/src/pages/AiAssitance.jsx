import { BrainIcon, DotSquare, Mic, Mic2Icon, MicIcon, MicOff, SearchIcon } from 'lucide-react'
import React, { useState, useRef, useEffect, useContext } from "react";
import BlurCircle from '../components/BlurCircle'
import { assets, dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SplashCursor from '../components/SplashCursor';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { parse } from 'marked'
import Card from '../components/Card';

function AiAssitance() {
    const { backendUrl, shows } = useContext(AppContent)
    const [userSentence, setUserSentence] = useState('');
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [userMovies, setUserMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [micOn, setMicOn] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    // const movies = shows.map((movie) => {
    //     const castNames = [];
    //     const genres = [];
    //     movie.casts.map((cast) => {
    //         castNames.push(cast.name);
    //     })
    //     movie.genres.map((genre) => {
    //         genres.push(genre.name);
    //     })
    //     return {
    //         id: movie._id,
    //         castNames: castNames,
    //         genres: genres,
    //         title: movie.title,
    //     }
    // })

    const handleSearch = async () => {
        if (!userSentence) return;
        setLoading(true);
        console.log(userSentence);
        try {
            const { data } = await axios.post(backendUrl + '/api/show/search', {prompt: userSentence });
            if(data.success){
                console.log(data.movies);
                setUserMovies(data.movies);
            }
            else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false);
    }

    const handleMicToggle = () => {
        if (micOn) {
            SpeechRecognition.stopListening();
            setMicOn(false);

            
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
            setMicOn(true);
        }
    };

    useEffect(() => {
        if (micOn) {
            setUserSentence(transcript);
        }
    }, [transcript, micOn]);

    return (
        <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-5'>
            {/* <SplashCursor/> */}
            <div className='flex flex-col flex-wrap'>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-center text-gray-400">
                    Can’t decide which movie to watch?
                </h1>
                <h2 className="text-xl  sm:text-2xl md:text-3xl font-semibold mb-8 text-center">
                    Let <BrainIcon className="inline text-white mr-2 mb-1 fill-primary" size={36} strokeWidth={1} />
                    <span className="font-bold text-yellow-400">AI</span> help you!
                </h2>
            </div>
            <div className='flex justify-center items-center gap-2'>
                <div className='flex flex-wrap justify-between rounded-full border border-primary px-4 py-2 '>
                    <input type='text' value={userSentence} onChange={(e) => setUserSentence(e.target.value)} className='text-gray-200 text-left outline-none mr-2 md:w-100 lg:200' placeholder='what type of movie you like?' />
                    <SearchIcon onClick={handleSearch} className='w-6 h-6 hover:scale-110 transition' />
                </div>
                <div onClick={handleMicToggle} className='rounded-full p-1.5 border-primary border-2'>
                    {micOn ? <MicIcon className='text-yellow-400 animate-pulse' strokeWidth={2}/> : <MicOff className='text-red-500' strokeWidth={2}/>}
                </div>
            </div>
            {
                loading ? <Loading /> :
                    userMovies.length > 0 ? (
                        <div className='pt-10'>
                            <BlurCircle top='150px' left='0px' />
                            <BlurCircle bottom='50px' right='50px' />
                            <h1 className='text-lg font-medium my-4 md:my-15'>Recommended for you</h1>
                            <div className='flex flex-wrap gap-6  justify-center'>
                                {userMovies.map((movie, index) => (
                                    <Card movie={movie} key={index}/>
                                ))}
                            </div>
                        </div>
                    ) : userSentence ? (
                        <div className='mt-10'>
                            <h1 className='text-2xl text-center text-gray-400'>Oops! No movie of your choice...</h1>
                        </div>
                    ): ""
            }

        </div>


    )
}

export default AiAssitance
