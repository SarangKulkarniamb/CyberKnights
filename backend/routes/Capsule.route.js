import express from 'express'
import { CapsuleUpload } from '../controllers/Capsule/Capsule.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'

import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/Capsule-upload',authMiddleware, upload.single('Banner'), CapsuleUpload)
    
export default router