import express from "express";
import {hash} from 'bcryptjs';
import User from '../models/user-model.js';
import { validationResult } from "express-validator";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function signup(req, res, next) {
   try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {         
         const error = new Error('Invalid input');
         error.statusCode = 422;
         error.data = errors.array();
         throw error;
      }

      const { email } = req.body;
      const { password } = req.body;
      const { name } = req.body;
      const hashedPassword = await hash(password, 12);

      const user = new User({
         email, 
         name,
         password: hashedPassword
      });
      const result = await user.save();

      res.status(201).json({
         message: 'User created successfully',
         userId: result._id
      });
   } catch (err) {
      if(!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
}