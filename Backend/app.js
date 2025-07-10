import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import feedRouter from './routes/feed-router.js';
import multer from "multer";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const __dirname = import.meta.dirname;

const fileFilter = (req, file, cb) => {
   const t = file.mimetype;
   if (t === 'image/png' || t === 'image/jpg' || t === 'image/jpeg') {
      cb(null, true);
   } else {
      cb(null, false);
   }
}

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
   }
});

const app = express();

// app.use(express.urlencoded());   //* Useful for requests that hold data in the format of | x-www-form-urlencoded | through <form> post requests
app.use(express.json());            //* Useful for Content-Type of application/json 

//* Single => file upload (only one file) whose name field is => image
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
   //* Allows any domain to access your API
   res.setHeader('Access-Control-Allow-Origin', '*');

   //* Specifies which HTTP methods are allowed when accessing the resource
   res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE');

   //* Specifies which headers can be used in the actual request
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});

app.use('/feed', feedRouter);

app.use((error, req, res, next) => {
   const status = error.statusCode || 500;
   const message = error.message;
   res.status(status).json({
      message: message
   });
})

await mongoose.connect(MONGODB_URI);
app.listen(PORT);