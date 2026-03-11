import express from 'express';
import * as jobController from '../controllers/job.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all job routes

router.route('/')
  .get(jobController.getAllJobs)
  .post(jobController.createJob);

router.route('/stats')
  .get(jobController.getJobStats);

router.route('/:id')
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

export default router;
