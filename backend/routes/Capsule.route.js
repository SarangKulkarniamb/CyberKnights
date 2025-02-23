import express from 'express'
import { CapsuleUpload, getCapsule, updateCapsule } from '../controllers/Capsule/Capsule.controller.js'
import {authMiddleware} from '../middleware/authmiddleware.js'
import {getCapsules} from '../controllers/Capsule/Capsule.controller.js'
import {upload} from '../cloudinary/cloudinary.js'
import { requestAccess } from '../controllers/Capsule/Capsule.controller.js'
import { deleteCapsule } from '../controllers/Capsule/Capsule.controller.js'
import { unlockCapsule } from '../controllers/Capsule/Capsule.controller.js'
import { getAdminCapsules } from '../controllers/Capsule/Capsule.controller.js'
import { grantAccess } from '../controllers/Capsule/Capsule.controller.js'

const router = express.Router()

router.post('/Capsule-upload',authMiddleware, upload.single('banner'), CapsuleUpload)
router.get('/getCapsules', authMiddleware,getCapsules)
router.get("/admin", authMiddleware, getAdminCapsules);
router.get('/:id', authMiddleware, getCapsule)
router.post('/:id/request-access', authMiddleware, requestAccess)
router.put("/:id", authMiddleware, updateCapsule);
router.delete("/:id", authMiddleware, deleteCapsule);
router.post("/:id/grant-access", authMiddleware, grantAccess);
router.post("/:id/unlock",authMiddleware,unlockCapsule);
export default router
