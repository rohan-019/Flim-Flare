import { LockIcon } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import toast from 'react-hot-toast';
import SplashCursor from '../components/SplashCursor';

function LoginPage() {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {backendUrl,setIsLoggedin,getUserData}=useContext(AppContent);

    const navigate=useNavigate();

    const onSubmitHandler=async (e) => {
        try {
            e.preventDefault();
            if(state === 'register'){
                const {data} = await axios.post(backendUrl + '/api/user/register',{name,email,password})
                if(data.success){
                    setIsLoggedin(true);
                    getUserData();
                    navigate('/');
                    toast.success(data.message);
                }
                else{
                    toast.error(data.message);
                }
            }
            else{
                const {data} = await axios.post(backendUrl + '/api/user/login',{email,password})
                if(data.success){
                    setIsLoggedin(true);
                    getUserData();
                    navigate('/');
                    toast.success(data.message);
                }
                else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className='px-6 md:px-16 lg:px-40 h-[100vh] flex justify-center items-center'>
            {/* <SplashCursor/> */}
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg bg-white text-black border border-gray-700 shadow-lg shadow-primary">

                <div className='flex gap-6'>
                    <img src='/catLogo.svg' alt="" className='w-auto h-6' />
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                </div>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <div className='flex gap-2 items-center border  rounded w-full p-2 mt-1  border-primary/80 text-black text-base'>
                            <img src="/person_icon.svg" alt="" className='w-4 h-4' />
                            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Full Name" className="outline-none" type="text" required />
                        </div>

                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <div className='flex gap-2 items-center border  rounded w-full p-2 mt-1  border-primary/80 text-black text-base'>
                        <img src="/mail_icon.svg" alt="" className='w-4 h-4' />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email" className="outline-none" type="email" required />
                    </div>

                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <div className='flex gap-2 items-center border  rounded w-full p-2 mt-1  border-primary/80 text-black text-base'>
                        <img src="/lock_icon.svg" alt="" className='w-4 h-4' />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter Password" className="outline-none" type="password" required />
                    </div>
                </div>
                {
                    state === "login" && <p className='text-primary cursor-pointer text-sm' onClick={()=>navigate('/reset-password')}>Forgot Password?</p>
                }
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary/90 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary/90 cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-primary/90 hover:bg-primary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    )
}

export default LoginPage
