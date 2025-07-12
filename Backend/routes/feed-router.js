import express from "express";
import * as feedController from '../controllers/feed-controller.js';
import { isAuth } from '../middleware/is-auth-middleware.js';
import { postValidationRules } from '../middleware/post-validator.js';
import { userValidationRules } from '../middleware/user-validator.js';

const router = express.Router();

router.get('/posts', 
   isAuth, 
   feedController.getPosts);

router.get('/post/:postId', 
   isAuth, 
   feedController.getPost);

router.post('/post', 
   isAuth, 
   postValidationRules.create,
   feedController.createPost);

router.put('/post/:postId', 
   isAuth, 
   postValidationRules.update,
   feedController.updatePost);

router.delete('/post/:postId', 
   isAuth, 
   postValidationRules.delete,
   feedController.deletePost);

router.get('/status', 
   isAuth, 
   feedController.getStatus);

router.put('/status',
   isAuth,
   userValidationRules.updateStatus,
   feedController.updateStatus);

export default router;