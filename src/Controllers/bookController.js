import Joi from 'joi';
import { BooksModel } from '../Models/BooksModel.js';
import path from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary';
import env from 'dotenv';
import { LogModel } from '../Models/LogModel.js';
env.config();
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
//CONIFIG JOI SCHEMA
const Schema = Joi.object({
  title: Joi.string().min(6).required(),
  category: Joi.string().min(6),
  penerbit: Joi.string().min(6).required(),
  image: Joi.string().min(6),
  releaseAt: Joi.string().min(6).required(),
  isbn: Joi.string(),
  jumlah_buku: Joi.string().required(),
  jumlah_halaman: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().min(6).required(),
});

//CREATE BOOK
export const addBook = (req, res) => {
  //VALIDATE DATA BEFORE ADD TO DB
  const { err } = Schema.validate(req.body);
  if (err) return res.status(400).json({ msg: err.details[0].message });
  //GET FILE
  if (req.file) {
    const file = req.file;
    //upload to cloudinary
    cloudinary.v2.uploader.upload(
      file.path,
      {
        folder: 'LIBRARY/books',
        // width: 250,
        // height: 250,
        // crop: 'fill',
      },
      (err, result) => {
        if (err) throw err;
        fs.unlinkSync(file.path);
        // if there is no error input
        const data = {
          ...req.body,
          available: Number(req.body.jumlah_buku),
          image: result.secure_url,
          public_id: result.public_id,
        };
        //create data or save data to db
        BooksModel.create(data, (err, data) => {
          if (err) return res.status(404).json({ msg: err.message });
          res.status(201).json({ msg: 'OK', data });
        });
      }
    );
  } else {
    // if there is no error input
    const data = {
      ...req.body,
      available: Number(req.body.jumlah_buku),
    };
    //create data or save data to db
    BooksModel.create(data, (err, data) => {
      if (err) return res.status(404).json({ msg: err.message });
      res.status(201).json({ msg: 'OK', data });
    });
  }
};

//GET BOOKS
export const getAllBooks = async (req, res) => {
  try {
    const respone = await BooksModel.find({}).sort({ updatedAt: 'desc' });

    return res.status(200).json({ msg: 'OK', data: respone });
  } catch (err) {
    if (err) return res.status(404).json({ msg: err.message });
  }
};

//GET BOOK BY ID
export const getBookById = (req, res) => {
  const { id } = req.params;
  BooksModel.findById(id, (err, data) => {
    if (err) return res.status(404).json({ msg: err.message });
    res.status(200).json({ msg: 'OK', data });
  });
};
// SEARCH BOOK
export const seachBookByName = (req, res) => {
  const { search } = req.params;
  BooksModel.find({ title: { $regex: '.*' + search + '.*', $options: 'i' } }, (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    // if (!data) return res.status(404).json({ msg: 'Upss, Not found the book' });
    if (data.length === 0) return res.status(404).json({ msg: 'Upss, Not found the book' });
    res.status(200).json({ msg: 'OK', data });
  });
};
//UPDATE BOOK
export const updateBook = (req, res) => {
  const { id } = req.params;
  BooksModel.findById(id, (err, book) => {
    if (err) return res.status(404).json({ msg: err.message });
    if (req.body.jumlah_buku) {
      LogModel.find((err, result) => {
        if (err) return res.status(400).json({ msg: err.message });
        const logs = result.filter((x) => JSON.stringify(x.data_book._id) === JSON.stringify(book._id));
        let available = Number(req.body.jumlah_buku) - logs.length;
        if (!req.file) {
          const data = {
            ...req.body,
            available,
          };
          BooksModel.findByIdAndUpdate(book.id, data, (err, dataLama) => {
            if (err) return res.status(400).json({ msg: err.message });
            res.status(201).json({ msg: 'Book updated!', data });
          });
        } else {
          //GET FILE
          const file = req.file;
          //upload to cloudinary
          cloudinary.v2.uploader.upload(
            file.path,
            {
              folder: 'LIBRARY/books',
              width: 250,
              height: 250,
              crop: 'fill',
            },
            (err, result) => {
              if (err) throw err;
              fs.unlinkSync(file.path);
              // if there is no error input
              const data = {
                ...req.body,
                available,
                image: result.secure_url,
                public_id: result.public_id,
              };
              // deleteFile(book.image);
              BooksModel.findByIdAndUpdate(book.id, data, async (err, dataLama) => {
                if (err) return res.status(400).json({ msg: err.message });
                await cloudinary.uploader.destroy(dataLama.public_id);
                res.status(201).json({ msg: 'Book updated!', data });
              });
            }
          );
        }
      });
    } else {
      if (!req.file) {
        const data = {
          ...req.body,
        };
        BooksModel.findByIdAndUpdate(book.id, data, (err, dataLama) => {
          if (err) return res.status(400).json({ msg: err.message });
          return res.status(201).json({ msg: 'Book updated!', data });
        });
      } else {
        //GET FILE
        const file = req.file;
        //upload to cloudinary
        cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'LIBRARY/books',
            width: 250,
            height: 250,
            crop: 'fill',
          },
          (err, result) => {
            if (err) throw err;
            fs.unlinkSync(file.path);
            // if there is no error input
            const data = {
              ...req.body,
              image: result.secure_url,
            };
            deleteFile(book.image);
            BooksModel.findByIdAndUpdate(book.id, data, async (err, dataLama) => {
              if (err) return res.status(400).json({ msg: err.message });
              await cloudinary.uploader.destroy(dataLama.public_id);
              return res.status(201).json({ msg: 'Book updated!', data });
            });
          }
        );
      }
    }
  });
};

//DELETE BOOK
export const deleteBook = (req, res) => {
  const { id } = req.params;
  BooksModel.findByIdAndDelete(id, async (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!data) return res.status(400).json({ msg: 'Data Not Found' });
    console.log(data);
    try {
      await cloudinary.uploader.destroy(data.public_id);
      deleteFile(data.image);
      return res.status(201).json({ msg: 'Book deleted!', data });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });
};

// PAGINATION API
export const paginationBooks = async (req, res) => {
  const skip = req.query?.skip || 0;
  const perPage = req.query?.perPage || 10;
  try {
    const response = await BooksModel.find({}).countDocuments();
    let totalData = response;
    const result = await BooksModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(perPage);
    return res.status(200).json({ msg: 'Success get data', data: result, totalData, perPage, total: result.length });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

//FUNCTIN FOR DELETE IMAGE IN STORE
const deleteFile = (filePath) => {
  let fileDir = path.join(__dirname, '/', filePath);
  console.log(fileDir);
  fs.unlink(fileDir, (err) => console.log(err));
};
