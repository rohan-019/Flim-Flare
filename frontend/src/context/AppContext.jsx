import axios from "axios";
axios.defaults.withCredentials = true;
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const baseUrl=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    // console.log(baseUrl);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const getAuthState = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/check-login');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/get-user-data');
            if (data.success) {
                setUserData(data.userData);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/is-admin');
            // console.log(data);
            
            if (data.success) {
                setIsAdmin(true);
            }
            if (!data.success && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('Not authorized to Access Admin Routes')
            }

        } catch (error) {
            toast.error(error.message);
        }
    }
    const fetchShows = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/show/all');
            if (data.success) {
                setShows(data.shows);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/favorites');
            if (data.success) {
                setFavoriteMovies(data.favorites);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);
    useEffect(()=>{
        fetchIsAdmin();
    },[])
    useEffect(() => {
        fetchShows();
    }, []);
    useEffect(() => {
        if (isLoggedin) {
            fetchFavoriteMovies();
        }
    }, [])
    // console.log();
    
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        isAdmin, setIsAdmin, fetchIsAdmin,
        navigate,
        shows,
        favoriteMovies, fetchFavoriteMovies,
        baseUrl,
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
