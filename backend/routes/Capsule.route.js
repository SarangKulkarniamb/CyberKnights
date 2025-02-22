import express from 'express'
import { CapsuleUpload, getCapsule } from '../controllers/Capsule/Capsule.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import {getCapsules} from '../controllers/Capsule/Capsule.controller.js'
import {upload} from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/Capsule-upload',authMiddleware, upload.single('banner'), CapsuleUpload)
router.get('/getCapsules', authMiddleware,getCapsules)
router.get('/:id', authMiddleware, getCapsule)
export default router
