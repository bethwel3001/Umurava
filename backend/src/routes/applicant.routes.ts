import { Router } from 'express';
import applicantController from '../controllers/applicant.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/test-get', (req, res) => res.json({ message: 'GET Success' }));
router.post('/', applicantController.createApplicant);
router.get('/', applicantController.getApplicants);
router.post('/screen', applicantController.screenApplicants);
router.post('/parse', applicantController.parseResume);
router.post('/test-upload', (req, res) => res.json({ message: 'Success' }));
router.post('/upload', upload.single('resume'), applicantController.uploadResume);
router.get('/results/:jobId', applicantController.getScreeningResults);
router.get('/:id', applicantController.getApplicantById);

export default router;
