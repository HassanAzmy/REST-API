import express from 'express';
import * as authController from '../controllers/auth-controller.js';
import { userValidationRules } from '../middleware/user-validator.js';

const router = express.Router();

router.put('/signup', 
   userValidationRules.signup,
   authController.signup);

router.post('/login', 
   userValidationRules.login,
   authController.login);

export default  router;