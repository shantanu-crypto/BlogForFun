import express from 'express'
import dotenve from 'dotenv'
import Router from './routes/route.js'
import cors from 'cors'
import bodyParser from 'body-parser'


import Connection from './database/db.js';
const app=express();

app.use(cors());
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',Router);

dotenve.config();

const PORT=8000;
app.listen(PORT,()=>{
    console.log(`server is running successfully on port ${PORT}`);
});

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;

Connection(USERNAME,PASSWORD);
