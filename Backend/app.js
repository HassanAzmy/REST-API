import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import multer from "multer";
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import feedRouter from './routes/feed-router.js';
import authRouter from './routes/auth-router.js';
import { socket } from './socket.js';

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

app.use(cors({
   //* Allows any domain to access your API
   origin: '*',

   //* Specifies which HTTP methods are allowed when accessing the resource
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

   //* Specifies which headers can be used in the actual request
   allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use((error, req, res, next) => {
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({
      message,
      data
   });
})

await mongoose.connect(MONGODB_URI);
const server = app.listen(PORT);
const io = socket.init(server);

//* connection means to wait for new connections so whenever a new client connects to us
//* sokcet is the client that did connect 
io.on('connection', socket => {
   console.log('Client connected');
})