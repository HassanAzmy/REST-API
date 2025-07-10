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