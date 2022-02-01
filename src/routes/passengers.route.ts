import * as PassengersController from '../controllers/passengers.controller';
import express from "express";

import { verifySession, validatePassengerRole } from '../middlewares/session';

const router = express.Router();

console.log('Registring roles routing /passengers');

console.log('[POST] MW /search/sevices ');
router.post('/search/services', verifySession, validatePassengerRole, PassengersController.searchServices);

console.log('[POST] MW /create/service ');
router.post('/create/service', verifySession, validatePassengerRole, PassengersController.createService);

console.log('[GET] MW /get/service/coords ');
router.get('/get/service/coords', verifySession, validatePassengerRole, PassengersController.getServiceCoords);

console.log('[GET] MW /cancel/service ');
router.get('/cancel/service', verifySession, validatePassengerRole, PassengersController.cancelService);

export {
  router as passengeresRoutes
}
