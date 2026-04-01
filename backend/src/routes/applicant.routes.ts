import { Router } from 'express';
import applicantController from '../controllers/applicant.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', applicantController.createApplicant);
router.get('/', applicantController.getApplicants);
router.get('/:id', applicantController.getApplicantById);
router.post('/screen', applicantController.screenApplicants);
router.post('/parse', applicantController.parseResume);
router.post('/upload', upload.single('resume'), applicantController.uploadResume);
router.get('/results/:jobId', applicantController.getScreeningResults);

export default router;
