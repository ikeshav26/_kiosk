import HelpTicket from '../models/HelpTicket.model.js';

export const createHelpTicket = async (req, res) => {
  try {
    const { subject, description, category } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and Description are required' });
    }
    const newTicket = new HelpTicket({ subject, description, category });
    await newTicket.save();
    return res.status(201).json({ message: 'Help Ticket Created Successfully', ticket: newTicket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllHelpTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find().sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await HelpTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Help Ticket Not Found' });
    }
    return res.status(200).json({ ticket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateHelpTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid Status' });
    }
    const ticket = await HelpTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Help Ticket Not Found' });
    }
    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();
    return res.status(200).json({ message: 'Help Ticket Status Updated', ticket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteHelpTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await HelpTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Help Ticket Not Found' });
    }
    await HelpTicket.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Help Ticket Deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
