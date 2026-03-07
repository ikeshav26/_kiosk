import mongoose from 'mongoose';

const multiLangField = (required = false) => ({
  en: { type: String, required, trim: true, default: '' },
  hi: { type: String, trim: true, default: '' },
  pa: { type: String, trim: true, default: '' },
});

const AnnouncementSchema = new mongoose.Schema(
  {
    subject: multiLangField(true),
    message: multiLangField(true),
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
