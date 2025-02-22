import express from 'express'
import { CapsuleUpload, getCapsulesall } from '../controllers/Capsule/Capsule.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import {getCapsules} from '../controllers/Capsule/Capsule.controller.js'
import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/Capsule-upload',authMiddleware, upload.single('banner'), CapsuleUpload)
router.get('/getCapsules', authMiddleware,getCapsules)

export default router
