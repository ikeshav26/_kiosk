import express from 'express';
import connectDb from './config/DB.js';
import kioskRoutes from './routes/Kiosk.routes.js';
import buildingRoutes from './routes/Building.routes.js';
import announcementRoutes from './routes/Announcement.routes.js';
import facultyRoutes from './routes/Faculty.routes.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.routes.js';
import helpTicketRoutes from './routes/HelpTicket.routes.js';
import { auth } from './middlewares/auth.middleware.js';

const app = express();
connectDb();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('Hello World');
});

app.get('/api/health', auth, (req, res) => {
  res.json({ status: 'ok', user: req.user });
});

app.use('/api/kiosk', kioskRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/help-ticket', helpTicketRoutes);

export default app;
