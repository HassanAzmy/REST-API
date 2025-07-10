import express from "express";
import Post from "../models/post-model.js";
import { validationResult } from "express-validator";


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getPosts(req, res, next) {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const error = new Error('Rendering a post failed');
         error.statusCode = 422;
         throw error;
      }

      const posts = await Post.find().limit(3);
      res.status(200).json({
         message: 'Fetched posts successfully',
         posts: posts
      });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getPost(req, res, next) {
   try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
         const error = new Error('Rendering a post failed');
         error.statusCode = 422; //* the data is incorrect or fails validation
         throw error;
      }

      const postId = req.params.postId;
      const post = await Post.findById(postId);

      if(!post) {
         const error = new Error('Post is not found');
         error.statusCode = 404; //* Server cannot find req resource
         throw error;
      }

      res.status(200).json({     //* Successful req
         post: post
      });
   } catch (err) {
      if(!err.statusCode) {
         err.statusCode = 500;   //* Internal unexpected server error
      }
      next(err);
   }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createPost(req, res, next) {
   try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
         const error = new Error('Invalid data for creating post');
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
      
      res.status(201).json({  //* Successful req and a new resource was created
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