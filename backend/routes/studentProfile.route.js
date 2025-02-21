import express from 'express'
import { studentProfileUpload } from '../controllers/profile/studentProfile.controller.js'
import {authMiddleware , roleMiddleware} from '../middleware/authmiddleware.js'

import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/profile-upload',authMiddleware, upload.single('profilePic'),roleMiddleware(['Student']), studentProfileUpload)
    
export default router