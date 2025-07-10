import express from "express";
import bodyParser from 'body-parser';

const app = express(); 

// app.use(bodyParser.urlencoded());   //? Useful for requests that hold data in the format of | x-www-form-urlencoded | through <form> post requests
app.use(bodyParser.json());            //? Useful for Content-Type of application/json 

app.listen(8080);