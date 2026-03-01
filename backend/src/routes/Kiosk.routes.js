import express from 'express';
import { registerKiosk } from '../controller/Kiosk.cotnroller.js';
import { saveMapData, getMapData } from '../controller/MapData.controller.js';

const router = express.Router();

router.post('/add', registerKiosk);

// Map data routes (nodes + paths for the navigation page)
router.post('/map-data', saveMapData);
router.get('/map-data', getMapData);

export default router;
