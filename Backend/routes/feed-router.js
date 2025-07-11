import express from "express";
import * as feedController from '../controllers/feed-controller.js';
import {body} from 'express-validator';

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.post('/post', [
   body('title')
      .trim()
      .isLength({min: 5}),
   body('content')
      .trim()
      .isLength({min: 5})
], feedController.createPost);

router.put('/post/:postId', [
   body('title')
      .trim()
      .isLength({ min: 5 }),
   body('content')
      .trim()
      .isLength({ min: 5 })
], feedController.updatePost);

router.delete('/post/:postId', feedController.deletePost);

export default router;