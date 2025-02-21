import express from 'express'
import { ProfileUpload } from '../controllers/profile/Profile.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'

import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/profile-upload',authMiddleware, upload.single('profilePic'), ProfileUpload)
    
export default router