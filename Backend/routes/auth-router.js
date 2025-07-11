import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth-controller.js'
import User from '../models/user-model.js';

const router = express.Router();

router.put('/signup', [
   body('email', 'please enter a valid email')
      .isEmail()
      .custom(async (value, {req}) => {
         const user = await User.findOne({ email: value });
         if (user) {                    
            const error = new Error('Email already exists');
            error.statusCode = 409; //* Data conflict
            throw error;
         }
      })
      .normalizeEmail(),
   body('password')
      .trim()
      .isLength({min: 3}),
   body('name')
      .isAlpha()
      .trim()
      .not()
      .isEmpty()
], authController.signup);

router.post('/login', authController.login);

export default  router;