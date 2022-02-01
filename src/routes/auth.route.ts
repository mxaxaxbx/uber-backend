import * as AuthController from '../controllers/auth.controller';
import express from "express";

import { verifySession } from '../middlewares/session';

const router = express.Router();

console.log('Registring roles routing /auth');

console.log('[POST] /register/driver ');
router.post('/register/driver', AuthController.registerDriver);

console.log('[POST] /register/passenger ');
router.post('/register/passenger', AuthController.registerPassenger);

console.log('[POST] /login ');
router.post('/login', AuthController.login);

console.log('[GET] MW /logout ');
router.get('/logout', verifySession, AuthController.logout);

export {
  router as authRoutes
}
