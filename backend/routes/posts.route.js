import express from 'express'
import { PostUpload } from '../controllers/posts/posts.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import { upload } from '../cloudinary/cloudinary.js'
import { posts } from '../controllers/posts/posts.controller.js'
const router = express.Router()

router.post('/post-upload' , authMiddleware , upload.single('media')  ,PostUpload)
router.get('/posts' , authMiddleware , posts)
export default router
