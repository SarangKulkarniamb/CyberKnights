import express from 'express'
import { GetProfile, ProfileUpload ,getUser,getUserContent } from '../controllers/profile/Profile.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
 
import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.get('/getUser/:id', authMiddleware, getUser)
router.post('/profile-upload',authMiddleware, upload.single('profilePic'), ProfileUpload)
router.get('/me',authMiddleware, GetProfile)
router.get('/user-content',authMiddleware, getUserContent)

export default router