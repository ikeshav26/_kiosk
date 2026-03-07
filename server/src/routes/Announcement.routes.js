import express from 'express';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
} from '../controller/Announcement.controller.js';

const router = express.Router();

router.post('/add', createAnnouncement);
router.get('/all', getAnnouncements);
router.get('/:id', getAnnouncementById);
router.get('/delete/:id', deleteAnnouncement);

export default router;
