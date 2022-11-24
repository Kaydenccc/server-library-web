import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './src/Routes/authRoute.js';
import { multerConfig } from './multerConfig.js';
import router from './src/Routes/route.js';
import routerLog from './src/Routes/logLibrary.js';

//CONFIG ENV
import env from 'dotenv';

env.config();
const port = process.env.PORT || 4000;

//CONFIG EXPRESS
const app = express();
app.use(cors({ credentials: true, origin: 'https://kaydencclibrary-app.netlify.app/' }));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use('/images', express.static('images'));
app.use('/books-images', express.static('booksImages'));

// KONFIGURASI MULTER
multerConfig(app);
// CONNECTION TO DB
mongoose.connect(process.env.URL_DB, { dbName: 'LibraryDB' }, (err) => {
  if (err) throw err;
  console.log('db connected');
  //ROUTE API AUTH
  app.get('/', (req, res) => {
    res.send('Successfully');
  });
  app.use('/api/auth/v1', authRoutes);
  app.use('/api/log/v1', routerLog);
  app.use('/api/books/v1', router);

  app.listen(port, () => {
    console.log('Server listenig on port ' + port);
  });
});
