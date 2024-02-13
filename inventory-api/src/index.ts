import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/router';
import cors from 'cors';
import fileUpload, { UploadedFile } from 'express-fileupload';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);


// Menjalankan server
app.listen(Number(process.env.app_port), () => {
    console.log(`${process.env.app_name_dev} running on port ${process.env.app_port}`);
});
