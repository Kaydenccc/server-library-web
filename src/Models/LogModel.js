import mongoose from 'mongoose';
const LogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    nama_peminjam: {
      type: String,
      required: true,
    },
    nim: {
      type: String,
      required: true,
    },
    bookID: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    nomor_hp: {
      type: String,
      required: true,
    },
    data_user: {
      type: Object,
      required: true,
    },
    data_book: {
      type: Object,
      required: true,
    },
    kodeTransaksi: String,
  },
  { timestamps: true }
);

export const LogModel = mongoose.model('log', LogSchema);
