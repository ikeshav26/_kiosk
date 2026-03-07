import express from 'express';
import {
  createHelpTicket,
  deleteHelpTicket,
  getAllHelpTickets,
  getTicketById,
  updateHelpTicketStatus,
} from '../controller/helpTicket.controller.js';

const router = express.Router();

router.post('/create', createHelpTicket);
router.get('/all', getAllHelpTickets);
router.get('/:id', getTicketById);
router.put('/update-status/:id', updateHelpTicketStatus);
router.delete('/delete/:id', deleteHelpTicket);

export default router;
