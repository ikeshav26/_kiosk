import MapData from '../models/MapData.model.js';
import { translateToAllLangs } from '../utils/translate.js';

/**
 * POST /api/kiosk/map-data
 * Body: { kioskId?, nodes: [...], paths: [...] }
 * Each path.label can be a plain English string OR already a { en, hi, pa } object.
 * Plain strings are auto-translated to all languages before saving.
 */
export const saveMapData = async (req, res) => {
  try {
    const { kioskId = 'default', nodes, paths } = req.body;

    if (!Array.isArray(nodes) || !Array.isArray(paths)) {
      return res.status(400).json({ message: 'nodes and paths must be arrays' });
    }

    // Translate labels that arrive as plain strings
    const translatedPaths = await Promise.all(
      paths.map(async (path) => {
        const rawLabel = path.label;
        // Already an object with at least `en` — use as-is
        if (rawLabel && typeof rawLabel === 'object' && rawLabel.en) {
          return path;
        }
        // Plain string — translate to all langs
        const labelStr = typeof rawLabel === 'string' ? rawLabel : String(rawLabel ?? path.id);
        const translated = await translateToAllLangs(labelStr, 'en');
        return { ...path, label: translated }; // { en, hi, pa }
      })
    );

    const doc = await MapData.findOneAndUpdate(
      { kioskId },
      { kioskId, nodes, paths: translatedPaths },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Map data saved', data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/kiosk/map-data?kioskId=default
 */
export const getMapData = async (req, res) => {
  try {
    const kioskId = req.query.kioskId ?? 'default';
    const doc = await MapData.findOne({ kioskId });
    if (!doc) return res.status(404).json({ message: 'No map data found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
