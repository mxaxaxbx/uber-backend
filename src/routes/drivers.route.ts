import * as DriverController from '../controllers/drivers.controller';
import express from "express";

import { verifySession, validateDriverRole } from '../middlewares/session';

const router = express.Router();

console.log('Registring roles routing /drivers');

console.log('[POST] MW /update/car ');
router.post('/update/car', verifySession, validateDriverRole, DriverController.updateCar);

console.log('[POST] MW /update/coords ');
router.post('/update/coords', verifySession, validateDriverRole, DriverController.setCoords);

console.log('[GET] MW /get/services ');
router.get('/get/services', verifySession, validateDriverRole, DriverController.getActiveServices);

console.log('[POST] MW /take/service ');
router.post('/take/service', verifySession, validateDriverRole, DriverController.takeService);

console.log('[POST] MW /end/service ');
router.post('/end/service', verifySession, validateDriverRole, DriverController.endServie);

export {
  router as driverRoutes
}
