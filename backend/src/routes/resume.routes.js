import express from 'express';
import * as resumeController from '../controllers/resume.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadPDF } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', uploadPDF.single('resume'), resumeController.analyzeResume);
router.get('/', resumeController.getAllAnalyses);

export default router;
