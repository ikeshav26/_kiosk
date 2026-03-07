import express from 'express';
import {
  addFaculty,
  addFacultyExcel,
  bulkAddFaculty,
  deleteFaculty,
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  exportFacultiesExcel,
} from '../controller/Faculty.controller.js';

const router = express.Router();

router.get('/export-excel', exportFacultiesExcel);
router.post('/add', addFaculty);
router.post('/add-excel', addFacultyExcel);
router.post('/bulk-add', bulkAddFaculty);
router.get('/all', getAllFaculties);
router.get('/:id', getFacultyById);
router.get('/delete/:id', deleteFaculty);
router.put('/update/:id', updateFaculty);

export default router;
