// import dotenv/config from 'dotenv';
import 'dotenv/config';
import app from './src/app.js';
import Connection from './config/db.js';

app.listen(process.env.PORT_NO, ()=>{
    console.log("Server is ON");
})