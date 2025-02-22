import express from 'express'
import { PostUpload } from '../controllers/posts/posts.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import { upload } from '../cloudinary/cloudinary.js'

const router = express.Router()

router.post('/post-upload' , authMiddleware , upload.single('media')  ,PostUpload)

export default router
