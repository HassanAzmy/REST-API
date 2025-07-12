import express from "express";
import * as feedController from '../controllers/feed-controller.js';
import {body} from 'express-validator';
import { isAuth } from '../middleware/is-auth-middleware.js';

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth, feedController.getPost);

router.post('/post', [
   body('title')
      .trim()
      .isLength({min: 5}),
   body('content')
      .trim()
      .isLength({min: 5})
], isAuth, feedController.createPost);

router.put('/post/:postId', [
   body('title')
      .trim()
      .isLength({ min: 5 }),
   body('content')
      .trim()
      .isLength({ min: 5 })
], isAuth, feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

export default router;