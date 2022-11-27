import { UserModel } from '../Models/UserModels.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import env from 'dotenv';
env.config();
import cloudinary from 'cloudinary';
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// CONFIG JOI VALIDATION
const Schema = Joi.object({
  username: Joi.string().min(6).required(),
  email: Joi.string().email().min(6).required(),
  password: Joi.string().min(6).required(),
  image: Joi.string(),
  nim: Joi.string().required(),
  angkatan: Joi.string().required(),
  profesi: Joi.string().required(),
  nomor_hp: Joi.string().required(),
  alamat: Joi.string().required(),
});

export const registerController = async (req, res) => {
  //VALIDASI DATA BEFORE BECOME A USER
  console.log(req.body);
  const { err } = Schema.validate(req.body);
  if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/g.test(req.body.nomor_hp)) return res.status(400).json({ msg: 'Invalid phone number' });
  if (err) return res.status(400).json({ msg: err.details[0].message });

  // CHECK EMAIL ALREADY EXIST OR NOT
  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ msg: 'Email already exist!' });
  // CHECK NIM ALREADY EXIST OR NOT
  const nimExist = await UserModel.findOne({ nim: req.body.nim });
  if (nimExist) return res.status(400).json({ msg: 'NIM already exist!' });
  // HAS PASSWORD USING BCRYPT
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  if (!req.file) {
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profesi: req.body.profesi,
      nomor_hp: req.body.nomor_hp,
      alamat: req.body.alamat,
      nim: req.body.nim,
      angkatan: req.body.angkatan,
      admin: false,
    };
    //create data or save data to db
    UserModel.create(data, (err, data) => {
      // IF ERROR
      if (err) return res.status(400).send(err);
      // SUCCESS
      res.status(201).json({ msg: 'Register success', data });
    });
  } else {
    //GET FILE
    const file = req.file;
    //upload to cloudinary
    cloudinary.v2.uploader.upload(
      file.path,
      {
        folder: 'LIBRARY/user_image',
        width: 150,
        height: 150,
        crop: 'fill',
      },
      (err, result) => {
        if (err) throw err;
        fs.unlinkSync(file.path);
        const data = {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          image: result.secure_url,
          public_id: result.public_id,
          profesi: req.body.profesi,
          nomor_hp: req.body.nomor_hp,
          nim: req.body.nim,
          angkatan: req.body.angkatan,
          alamat: req.body.alamat,
          admin: req.body.profesi === 'Admin' ? true : false,
        };
        //create data or save data to db
        UserModel.create(data, (err, data) => {
          // IF ERROR
          if (err) return res.status(400).send(err);
          // SUCCESS
          res.status(201).json({ msg: 'Register success', data });
        });
      }
    );
  }
};

// GET USERS
export const getUsers = (req, res) => {
  UserModel.find({}, (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    res.status(200).json({ msg: 'OK', data });
  }).sort({ updatedAt: 'desc' });
};
// GET USERS BY ID
export const getUsersById = (req, res) => {
  const { id } = req.params;
  UserModel.findById(id, (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    res.status(200).json({ msg: 'OK', data });
  });
};
// SEARCH USER
export const seachUserByName = (req, res) => {
  const { search } = req.params;
  UserModel.find({ username: { $regex: '.*' + search + '.*', $options: 'i' } }, (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (data.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.status(200).json({ msg: 'OK', data });
  });
};

//UPDATE USER
export const updateUser = async (req, res) => {
  //VALIDATE DATA BEFORE ADD TO DB
  const { err } = Schema.validate(req.body);
  if (err) return res.status(400).json({ msg: err.details[0].message });

  const { id } = req.params;
  UserModel.findById(id, async (err, book) => {
    if (req.body.nim !== book.nim) {
      // CHECK NIM ALREADY EXIST OR NOT
      const nimExist = await UserModel.findOne({ nim: req.body.nim });
      if (nimExist) return res.status(400).json({ msg: 'NIM already exist!' });
    }
    if (err) return res.status(404).json({ msg: err.message });
    let data = '';
    if (!req.file) {
      data = {
        ...req.body,
      };
      UserModel.findByIdAndUpdate(book.id, data, (err, dataLama) => {
        if (err) return res.status(400).json({ msg: err.message });
        res.status(201).json({ msg: 'User updated!', data });
      });
    } else {
      //GET FILE
      const file = req.file;
      cloudinary.v2.uploader.upload(
        file.path,
        {
          folder: 'LIBRARY/user_image',
          width: 150,
          height: 150,
          crop: 'fill',
        },
        (err, result) => {
          if (err) throw err;

          data = {
            ...req.body,
            image: result.secure_url,
            public_id: result.public_id,
          };
          UserModel.findByIdAndUpdate(book.id, data, async (err, dataLama) => {
            if (err) return res.status(400).json({ msg: err.message });
            await cloudinary.uploader.destroy(dataLama.public_id);
            res.status(201).json({ msg: 'User updated!', data });
          });
          fs.unlinkSync(file.path);
          // deleteFile(file.path);
        }
      );
    }
  });
};

//DELETE USER
export const deleteUser = (req, res) => {
  const { id } = req.params;
  UserModel.findByIdAndDelete(id, async (err, data) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!data) return res.status(400).json({ msg: 'Data Not Found' });
    await cloudinary.uploader.destroy(data.public_id);
    deleteFile(data.image);
    return res.status(201).json({ msg: 'User deleted!', data });
  });
};

// PAGINATION API
export const paginationUsers = async (req, res) => {
  const skip = Number(req.query?.skip) || 0;
  const perPage = req.query?.perPage || 35;
  try {
    const response = await UserModel.find().countDocuments();
    let totalData = response;
    const result = await UserModel.find({}).sort({ updatedAt: 'desc' }).skip(skip).limit(perPage);
    return res.status(200).json({ msg: 'Success get data', data: result, totalData, perPage, total: result.length });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

//FUNCTIN FOR DELETE IMAGE IN STORE
const deleteFile = (filePath) => {
  let fileDir = path.join(__dirname, '/', filePath);
  fs.unlink(fileDir, (err) => console.log(err));
};
