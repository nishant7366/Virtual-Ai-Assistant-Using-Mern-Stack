import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
            console.log(result.data)
            setUserData(result.data)
            navigate('/')


        } catch (error) {
            console.log(error)
        }
    }





    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04119b]
    flex justify-center items-center flex-col relative'>

            <IoMdArrowBack className='absolute  top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate('/customize')} />

            <h1 className='text-white text-[30px] text-center mb-[40px]'>Enter Your {" "}<span className='text-blue-400'>Assistant Name</span></h1>
            <input type="text" placeholder='Enter Your Name' className='w-full max-w-[600px] h-[60px] outline-none
                     border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px]
                      py-[20px] rounded-full text-[18px]  focus:outline-none focus:ring-2 focus:ring-blue-500'
                required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />

            {assistantName && <button className='min-w-[200px] h-[60px] mt-[30px] text-black font-semibold
             bg-white rounded-full text-[19px] cursor-pointer ' onClick={() => {
                    handleUpdateAssistant()
                }}>Create Your Assistant</button>
            }



        </div>
    )
}

export default Customize2
