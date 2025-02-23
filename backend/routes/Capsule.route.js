import express from 'express'
import { CapsuleUpload, getCapsule, updateCapsule } from '../controllers/Capsule/Capsule.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import {getCapsules} from '../controllers/Capsule/Capsule.controller.js'
import {upload} from '../cloudinary/cloudinary.js'
import { requestAccess } from '../controllers/Capsule/Capsule.controller.js'
import { deleteCapsule } from '../controllers/Capsule/Capsule.controller.js'
const router = express.Router()

router.post('/Capsule-upload',authMiddleware, upload.single('banner'), CapsuleUpload)
router.get('/getCapsules', authMiddleware,getCapsules)
router.get('/:id', authMiddleware, getCapsule)
router.post('/:id/request-access', authMiddleware, requestAccess)
router.put("/Capsule-update/:id", upload.single("banner"), updateCapsule);
router.delete("/Capsule-delete/:id", deleteCapsule);
export default router
