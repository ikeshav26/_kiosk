import express from 'express';
import {
  addFaculty,
  addFacultyExcel,
  bulkAddFaculty,
  deleteFaculty,
  bulkDeleteFaculty,
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
router.post('/bulk-delete', bulkDeleteFaculty);
router.get('/all', getAllFaculties);
router.get('/:id', getFacultyById);
router.get('/delete/:id', deleteFaculty);
router.put('/update/:id', updateFaculty);

export default router;
