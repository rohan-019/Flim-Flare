import React, { useContext, useEffect, useRef, useState } from 'react'
import OtpInput from "react-otp-input";
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

function ResetPassword() {

  const { backendUrl } = useContext(AppContent);

  const navigate=useNavigate();

  const [email, setEmail] = useState('');
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [otp,setOtp] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmiited] = useState(false);

  const inputRefs = useRef([]);

  const handleKeyDown = (e) => {
    const index = inputRefs.current.indexOf(e.target);

    if (
      !/^[0-9]$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setOtpArray((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      if (otpArray[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "Delete") {
      e.preventDefault();
      setOtpArray((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
    }
  };


  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtpArray((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otpArray.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otpArray.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtpArray(digits);
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpStr = otpArray.join("");
      setOtp(otpStr);
      console.log(otpStr);
      setIsOtpSubmiited(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      console.log(email,otp,newPassword);
      const { data } = await axios.post(backendUrl + '/api/user/reset-password', {email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(false);
        setIsOtpSubmiited(false);
        navigate("/login");
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-40 h-[100vh] flex flex-wrap items-center justify-center'>

      {/* Entering email for getting otp */}

      {!isEmailSent && <form onSubmit={onSubmitEmail} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg bg-white text-black">
        <div className='flex gap-6'>
          <img src='/catLogo.svg' alt="" className='w-auto h-6' />
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Reset</span> Password
          </p>
        </div>
        <div className="w-full ">
          <p>Email</p>
          <div className='flex gap-2 items-center border  rounded w-full p-2 mt-1  border-primary/80 text-black text-base'>
            <img src="/mail_icon.svg" alt="" className='w-4 h-4' />
            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Email" className="outline-none" type="email" required />
          </div>
        </div>
        <button className="bg-primary/90 hover:bg-primary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Get OTP
        </button>
      </form>}

      {/* entering otp */}

      {isEmailSent && !isOtpSubmitted && <form onSubmit={onSubmitOtp} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg bg-white text-black">
        <div className='flex gap-6'>
          <img src='/catLogo.svg' alt="" className='w-auto h-6' />
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Password</span> OTP
          </p>
        </div>
        <div className="w-full">
          <p className='mb-2'>OTP</p>
          <div className='flex  justify-between flex-wrap'>
            {otpArray.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                className="flex w-[40px] h-[40px] items-center justify-center rounded-lg border border-primary bg-white p-3 text-center text-lg font-light text-black outline-none"
              />
            ))}
          </div>

        </div>
        <button className="bg-primary/90 hover:bg-primary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Submit OTP
        </button>
      </form>}

      {/* Entering newPassword */}
      {isEmailSent && isOtpSubmitted && <form onSubmit={onSubmitNewPassword} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg bg-white text-black">
        <div className='flex gap-6'>
          <img src='/catLogo.svg' alt="" className='w-auto h-6' />
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">New</span> Password
          </p>
        </div>
        <div className="w-full">
          <p>Password</p>
          <div className='flex gap-2 items-center border  rounded w-full p-2 mt-1  border-primary/80 text-black text-base'>
            <img src="/lock_icon.svg" alt="" className='w-4 h-4' />
            <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Enter New Password" className="outline-none" type="password" required />
          </div>
        </div>
        <button className="bg-primary/90 hover:bg-primary/80 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Reset Password
        </button>
      </form>}
    </div>
  )
}

export default ResetPassword
