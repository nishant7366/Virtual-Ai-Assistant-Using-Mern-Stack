import express from 'express'
import { Login, signUp, logOut } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signin',  Login)
authRouter.get('/logout', logOut)
authRouter.post('/signup', signUp)

export default authRouter