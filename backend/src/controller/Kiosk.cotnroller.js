import Kiosk from '../models/kiosk.model.js';

export const registerKiosk = async (req, res) => {
  try {
    const { name, coordinates } = req.body;
    if (!name || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingKiosk = await Kiosk.findOne({ name });
    if (existingKiosk) {
      return res.status(400).json({ message: 'Kiosk with this name already exists' });
    }
    const kiosk = new Kiosk({
      name,
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
    });
    await kiosk.save();
    res.status(201).json({ message: 'Kiosk registered successfully', kiosk });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
