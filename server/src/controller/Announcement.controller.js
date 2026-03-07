import Announcement from '../models/Announcement.model.js';
import { translateToAllLangs } from '../utils/translate.js';

const VALID_LANGS = ['en', 'hi', 'pa'];
const getLang = (query) => (VALID_LANGS.includes(query?.lang) ? query.lang : 'en');

export const createAnnouncement = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const [subjectTranslations, messageTranslations] = await Promise.all([
      translateToAllLangs(subject),
      translateToAllLangs(message),
    ]);

    const announcement = new Announcement({
      subject: subjectTranslations,
      message: messageTranslations,
    });
    await announcement.save();

    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

const localize = (doc, lang) => ({
  _id: doc._id,
  subject: doc.subject[lang] || doc.subject.en,
  message: doc.message[lang] || doc.message.en,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const getAnnouncements = async (req, res) => {
  try {
    const lang = getLang(req.query);
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ announcements: announcements.map((a) => localize(a, lang)) });
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = getLang(req.query);

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.status(200).json({ announcement: localize(announcement, lang) });
  } catch (err) {
    console.error('Error fetching announcement:', err);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: 'Announcement deleted successfully', deletedAnnouncement });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
