import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'

export const signUp = async (req, res)=>{
    try {
        const{name, email, password} = req.body
        const existEmail= await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"user already exists"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 character"})
        }

        const hashePassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password:hashePassword
        }) 

        const token = await genToken(user._id)

        res.cookie('token', token, {
             httpOnly:true,
             maxAge: 7*24*60*60*1000,
             sameSite: "strict",
             secure:false
        })

        return res.status(201).json({
            message: "User Created Successfully",
            user
        })
        


    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'signUp error'})
    }
}




export const Login = async (req, res)=>{
    try {
        const{email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"email does not exists"})
        }
       
        const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch){
        return res.status(400).json({message:"Incorrect password"})
      }

        const token = await genToken(user._id)

        res.cookie('token', token, {
             httpOnly:true,
             maxAge: 7*24*60*60*1000,
             sameSite: "strict",
             secure:false
        })

        return res.status(200).json({
            message: "User Login Successfully",
            user
        })
        


    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Login error'})
    }
}


export const logOut = async(req, res)=>{
    try {
        res.clearCookie('token')
         return res.status(200).json({
            message: "User Login Successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'logOut error'})
    }
}