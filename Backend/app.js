import express from "express";
import dotenv from 'dotenv';
import feedRouter from './routes/feed-router.js';

dotenv.config();
const PORT = process.env.PORT || 3000;


const app = express();

// app.use(express.urlencoded());   //? Useful for requests that hold data in the format of | x-www-form-urlencoded | through <form> post requests
app.use(express.json());            //? Useful for Content-Type of application/json 

app.use((req, res, next) => {
   //? Allows any domain to access your API
   res.setHeader('Access-Control-Allow-Origin', '*');

   //? Specifies which HTTP methods are allowed when accessing the resource
   res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE');

   //? Specifies which headers can be used in the actual request
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});

app.use('/feed', feedRouter);

app.listen(PORT);