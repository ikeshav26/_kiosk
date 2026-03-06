import express from 'express';
import connectDb from './config/DB.js';
import kioskRoutes from './routes/Kiosk.routes.js';
import buildingRoutes from './routes/Building.routes.js';
import announcementRoutes from './routes/Announcement.routes.js';
import facultyRoutes from './routes/Faculty.routes.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.routes.js';
import helpTicketRoutes from './routes/HelpTicket.routes.js';
import scheduleRoutes from './routes/Schedule.routes.js'
import cors from 'cors';

const app = express();
connectDb();

const allowedOrigins = [
  process.env.ADMIN_PORTAL_URL,
  process.env.KIOSK_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} is not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('BFGI kiosk API....');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/kiosk', kioskRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/help-ticket', helpTicketRoutes);
app.use('/api/schedule',scheduleRoutes)

export default app;
