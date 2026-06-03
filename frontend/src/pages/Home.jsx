import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ai from "../assets/ai.gif"
import userImg from "../assets/user.gif"

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [lastText, setLastText] = useState("")

  // 🔴 LOGOUT
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate('/signin')
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  // 🔊 SPEAK
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)

    utterence.onend = () => {
      setAiText("")   
    }

    window.speechSynthesis.speak(utterence)
  }

  // 🎯 COMMAND HANDLER
  const handleCommand = (data) => {
    const { type, userInput, response } = data

    speak(response)

    if (type === "google_search") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, '_blank')
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, '_blank')
    }

    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }

    if (type === "youtube_search" || type === 'youtube_play') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
    }
  }

  //  SPEECH RECOGNITION
  useEffect(() => {
    if (!userData) return

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.lang = 'en-US'

    let isProcessing = false   // 🔥 LOCK

    recognition.onresult = async (e) => {

      if (isProcessing) return   

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim()

      console.log("heard :", transcript)

      if (!transcript) return

      // 🛑 duplicate ignore
      if (transcript === lastText) return
      setLastText(transcript)

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {

        isProcessing = true   

        setAiText("")
        setUserText(transcript)

        recognition.stop()

        const data = await getGeminiResponse(transcript)

        isProcessing = false   

        if (!data) {
          setTimeout(() => recognition.start(), 2000)
          return
        }

        handleCommand(data)
        setAiText(data.response)
        setUserText("")

        setTimeout(() => {
          recognition.start()
        }, 2000)
      }
    }

    recognition.start()

    return () => {
      recognition.stop()
    }

  }, [userData])

  
  useEffect(() => {
    if (!userData) return

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    )

    greeting.lang = 'en-US'
    window.speechSynthesis.speak(greeting)

  }, [userData])

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#04119b]
    flex flex-col items-center gap-4 relative'>

      {/* 🔥 BUTTONS */}
      <div className="w-full flex justify-center lg:justify-end gap-4 p-4">
  
  <button
    className='min-w-[140px] h-[50px] text-white font-semibold
    bg-white/10 backdrop-blur-md border border-white/20
    rounded-full hover:bg-white/20 transition-all duration-300'
    onClick={handleLogOut}
  >
    LogOut
  </button>

  <button
    className='min-w-[180px] h-[50px] text-white font-semibold
    bg-white/10 backdrop-blur-md border border-white/20
    rounded-full hover:bg-white/20 transition-all duration-300'
    onClick={() => navigate('/customize')}
  >
    Customize
  </button>
      </div>

      {/* 🤖 IMAGE */}
      <div className='w-[280px] h-[380px] flex justify-center items-center overflow-hidden rounded-3xl'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover rounded-xl' />
      </div>

      <h1 className='text-white text-xl'>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt="" className='w-[180px]' />}
      {aiText && <img src={ai} alt="" className='w-[180px]' />}

      <h1 className='text-white text-lg font-bold text-center px-4'>
        {userText ? userText : aiText ? aiText : null}
      </h1>

    </div>
  )
}

export default Home