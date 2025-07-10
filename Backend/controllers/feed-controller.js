import express from "express";

/** @param {express.Request} req */
export async function getPosts(req, res, next) {
   res.status(200).json({
      posts: [
         {
            title: 'First Post',
            content: 'This is the first post!'
         },
      ]
   });
}

/** @param {express.Request} req */
export async function createPost(req, res, next) {
   const { title } = req.body;
   const { content } = req.body;
   console.log(title, content);

   // create post in db
   res.status(201).json({
      message: 'Post created successfully!',
      post: {
         id: new Date().toISOString(),
         title,
         content
      },
   });
}