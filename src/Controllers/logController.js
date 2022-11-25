import { LogModel } from '../Models/LogModel.js';
import Joi from 'joi';
import shortid from 'shortid';
import { UserModel } from '../Models/UserModels.js';
import { BooksModel } from '../Models/BooksModel.js';
//CONFIG JOI
const Schema = Joi.object({
  nama_peminjam: Joi.string().min(4).required(),
  nim: Joi.string().required(),
  alamat: Joi.string().required(),
  nomor_hp: Joi.string().required(),
});

//ADD LOG
export const addLog = (req, res) => {
  // VALIDATE DATA
  const { err } = Schema.validate(req.body);
  if (err) return res.status(400).json({ msg: err.details[0].message });
  UserModel.findOne({ nim: req.body.nim }, (err, user) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!user) return res.status(404).json({ msg: 'NIM tidak ditemukan' });
    BooksModel.findById(req.body.bookID, (err, book) => {
      if (err) return res.status(400).json({ msg: err.message });
      if (!book) return res.status(404).json({ msg: 'Buku dengan id "' + req.body.bookID + '" tidak ditemukan' });
      // JIKA TIDAK TERSEDIA
      if (book.available < 1) {
        return res.status(400).json({ msg: 'Buku tidak tersedia' });
      }
      const dataUpdate = {
        ...book._doc,
        available: book.available - 1,
      };
      BooksModel.findByIdAndUpdate(book._id, dataUpdate, (err, old) => {
        if (err) return res.status(400).json({ msg: err.message });
        const dataPeminjam = { ...req.body, title: book.title, kodeTransaksi: shortid.generate(), data_user: user, data_book: dataUpdate };
        LogModel.create(dataPeminjam, (err, data) => {
          if (err) return res.status(400).json({ msg: err.message });
          res.status(201).json({ msg: 'OK', data });
        });
      });
    });
  }).select('-password');
};

//GET LOGS
export const getLogs = (req, res) => {
  LogModel.find((err, data) => {
    if (err) res.status(400).json({ msg: err.message });
    res.status(201).json({ msg: 'OK', data });
  }).sort({ updatedAt: 'desc' });
};

//UDPATE LOG
export const updatelog = (req, res) => {
  const { id } = req.params;
  LogModel.findById(id, (err, log) => {
    if (err) return res.status(400).json({ msg: err.message });
    const data = req.body;
    LogModel.findByIdAndUpdate(log.id, data, (err, datalog) => {
      if (err) return res.status(400).json({ msg: err.message });
      res.status(201).json({ msg: 'Updated', data });
    });
  });
};
//GET LOG BY ID
export const getLogById = (req, res) => {
  const { id } = req.params;
  LogModel.findById(id, (err, log) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!log) return res.status(404).json({ msg: 'Data transaksi tidak ditemukan' });
    res.status(200).json({ msg: 'OK', log });
  });
};

//DELETE LOG
export const deletelog = (req, res) => {
  const { id } = req.params;
  //FIND LOG BY ID END REDUCE JUMLAH_BUKU
  LogModel.findByIdAndDelete(id, (err, log) => {
    if (err) return res.status(400).json({ msg: err.message });
    BooksModel.findById(log.data_book?._id, (err, book) => {
      if (err) return res.status(400).json({ msg: err.message });
      if (!book) return res.status(404).json({ msg: 'Buku dengan nama "' + req.body.title + '" tidak ditemukan' });
      let jumlahBook = book.available;
      if (book.available < Number(book.jumlah_buku)) {
        jumlahBook = book.available + 1;
      }
      const dataUpdate = {
        ...book._doc,
        available: jumlahBook,
      };
      BooksModel.findByIdAndUpdate(book._id, dataUpdate, (err, old) => {
        if (err) return res.status(400).json({ msg: err.message });
        res.status(200).json({ msg: 'Deleted', dataUpdate });
      });
    });
  });
};

//SEARCH LOG
export const searchlog = (req, res) => {
  const { search } = req.params;
  LogModel.findOne({ kodeTransaksi: search }, (err, log) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!log) return res.status(404).json({ msg: 'Not Found Transaksi' });
    res.status(200).json({ msg: 'OK', log });
  });
};

// PAGINATION API
export const paginationLogs = async (req, res) => {
  const skip = req.query.skip || 0;
  const perPage = req.query.perPage || 20;
  try {
    const response = await LogModel.find().countDocuments();
    let totalData = response;
    const result = await LogModel.find({}).sort({ updatedAt: 'desc' }).skip(skip).limit(perPage);
    return res.status(200).json({ msg: 'Success get data', data: result, totalData, perPage });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};
