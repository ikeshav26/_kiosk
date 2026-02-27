import express from 'express';
import {
  addFaculty,
  deleteFaculty,
  getAllFaculties,
  getFacultyById,
} from '../controller/Faculty.controller.js';

const router = express.Router();

router.post('/add', addFaculty);
router.get('/all', getAllFaculties);
router.get('/:id', getFacultyById);
router.get('/delete/:id', deleteFaculty);

export default router;
