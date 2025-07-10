import express from "express";
import * as feedController from '../controllers/feed-controller.js';

const router = express.Router();

router.get('/posts', feedController.getPosts);

export default router;