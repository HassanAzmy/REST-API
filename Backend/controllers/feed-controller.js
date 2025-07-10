import express from "express";
import Post from "../models/post-model.js";
import { validationResult } from "express-validator";

/** @param {express.Request} req */
export async function getPosts(req, res, next) {
   res.status(200).json({
      posts: [
         {
            _id: '1',
            title: 'First Post',
            content: 'This is the first post!',
            imageUrl: 'images/Hitman.png',
            creator: {
               name: 'Azmy'
            },
            createdAt: new Date()
         },
      ]
   });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createPost(req, res, next) {
   try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
         const error = new Error('Validation failed.');
         error.statusCode = 422;
         throw error;
      }

      const { title } = req.body;
      const { content } = req.body;

      const post = new Post({
         title: title,
         content: content,
         imageUrl: 'images/Hitman.png',
         creator: {
            name: 'Azmy'
         }
         //* The createdAt is done by mongoose through timestamps:true
      });
      const result = await post.save();
      
      res.status(201).json({
         message: 'Post Created Successfully',
         post: result
      });
   } catch(err) {
      if(!err.statusCode) {
         err.statusCode = 500 //* server-side error
      }
      next(err);
   }
}