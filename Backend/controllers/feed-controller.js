import express from "express";
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
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
      res.status(422).json({
         message: 'Validation failed',
         errors: errors.array()
      });
   }

   const { title } = req.body;
   const { content } = req.body;

   
   // create post in db
   res.status(201).json({
      message: 'Post created successfully!',
      post: {
         _id: new Date().toISOString(),
         title,
         content,
         creator: {
            name: 'Azmy'
         },
         createdAt: new Date()
      },
   });
}