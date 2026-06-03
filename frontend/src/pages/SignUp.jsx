import React from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import { useContext } from 'react';
import axios from 'axios'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const{serverUrl,userData, setUserData} = useContext(userDataContext)
    const navigate = useNavigate();
     const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const[err, setErr] = useState("")
    const[loading, setLoading] = useState(false)

    const handleSignUp = async(e)=>{
        e.preventDefault()
        setErr("")
         setLoading(true)
        try {
             let result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name, email, password
             }, {withCredentials:true})

             setUserData(result.data.user)
             navigate("/customize")
             setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setUserData(null)
            setErr(error.response?.data?.message || "Something went wrong")
        }

    }

    return (
        <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
            <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex
                             flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignUp}>

                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>register to {" "}
                    <span className='text-blue-800'>Virtual Assistant</span></h1>

                <input type="text" placeholder='Enter Your Name' className='w-full h-[60px] outline-none
                     border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px]
                      py-[20px] rounded-full text-[18px]  focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required onChange={(e)=>setName(e.target.value)}  value={name}/>


                <input type="email" placeholder='Enter Your Email' className='w-full h-[60px] outline-none
                     border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px]
                      py-[20px] rounded-full text-[18px]  focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required onChange={(e)=>setEmail(e.target.value)}  value={email}/>



                       <div className='w-full h-[60px] border-2 border-white bg-transparent text-white 
                rounded-full text-[18px]
                focus-within:ring-2 focus-within:ring-blue-500 relative'>


                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter Your Password'
                        className='w-full h-full rounded-full outline-none
               bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
               required onChange={(e)=>setPassword(e.target.value)}  value={password}/>

                    {!showPassword && <IoEye className='absolute top-[20px] right-[20px] text-white cursor-pointer text-2xl' onClick={() => setShowPassword(true)} />}
                    {showPassword && <IoEyeOff className='absolute top-[20px] right-[20px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}

                </div>

                {err.length>0 && <p className='text-red-500 text-xl'>
                    *{err}
                    </p>}

                  <button type='submit' className='w-[150px] h-[60px] mt-5 rounded-full bg-[#00000000] backdrop-blur text-xl text-white' disabled={loading}>{ loading?"...loading":"Signup"}</button>
                <p className='text-xl  text-white'>Already have an account {" "}<span className='text-blue-400 cursor-pointer'
                    onClick={() => navigate('/signin')}>Sign In</span></p>

            </form>

        </div>
    )
}

export default SignUp
