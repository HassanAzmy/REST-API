import express from "express";
import fs from 'fs';
import path from 'path';
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

      const posts = await Post.find().limit(4);
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

      const {postId} = req.params;
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
      const { title } = req.body;
      const { content } = req.body;
      const image = req.file;

      const errors = validationResult(req);
      if(!errors.isEmpty() || !image) {
         let message = 'Invalid data for creating post';
         if(!image) {
            message = 'Invalid image format';
         }
         const error = new Error(message);
         error.statusCode = 422;
         throw error;
      }
      
      const imageUrl = image.path.replace(/\\/g, "/");
      const post = new Post({
         title: title,
         content: content,
         imageUrl: imageUrl,
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

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function updatePost(req, res, next) {
   try {
      const { postId } = req.params;
      const { title } = req.body;
      const { content } = req.body;
      const image = req.file;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const error = new Error('Invalid data for creating post');
         error.statusCode = 422;
         throw error;
      }
      
      const oldPost = await Post.findById(postId);
      if(!oldPost) {         
         const error = new Error('Post not found');
         error.statusCode = 404;
         throw error;
      }
      
      if(image) {                  
         clearImage(oldPost.imageUrl);
         const imageUrl = image.path.replace(/\\/g, "/");
         oldPost.imageUrl = imageUrl;
      }
      
      oldPost.title = title;
      oldPost.content = content;
      const result = await oldPost.save();
      
      res.status(201).json({  //* Successful req and a new resource was created
         message: 'Post Updated Successfully',
         post: result
      });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500 //* server-side error
      }
      next(err);
   }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function clearImage(filePath) {
   try {
      const __dirname = import.meta.dirname;
      filePath = path.join(__dirname, '..', filePath);
      fs.unlink(filePath, err => console.log(err));
   } catch (err) {
      
   }
}