import express from 'express'
import { register , login , logout , verifyEmail ,forgotPassword, resetPassword, check_auth} from '../controllers/auth/userAuth.controller.js'
const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

router.post('/verify', verifyEmail)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token' , resetPassword)

router.get('/check-auth' , check_auth)
export default router
