import multer from 'multer';
import { UserModel } from './src/Models/UserModels.js';
export const multerConfig = (app) => {
  //COONFIGURASI MULTER
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.path === '/api/books/v1/add/book') {
        // jika pathnya "/add/book"
        cb(null, 'booksImages');
      } else {
        cb(null, 'images');
      }
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + '-' + file.originalname);
    },
  });
  const fileFilter = async (req, file, cb) => {
    // CHECK EMAIL ALREADY EXIST OR NOT
    if (req.path === '/api/auth/v1/register') {
      const emailExist = await UserModel.findOne({ email: req.body.email });
      if (emailExist) {
        return cb(null, false);
      }
    }
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  app.use(multer({ storage, fileFilter }).single('image'));
};
