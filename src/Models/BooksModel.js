import mongoose from 'mongoose';

const BooksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: String,
    image: { type: String, default: 'https://res.cloudinary.com/diqsivizd/image/upload/v1668617256/LIBRARY/books/pngfind.com-book-icon-png-485887_ttm2gs.png' },
    penerbit: {
      type: String,
      required: true,
    },
    releaseAt: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
    },
    public_id: {
      type: String,
    },
    jumlah_buku: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
    },
    jumlah_halaman: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const BooksModel = mongoose.model('bookmodel', BooksSchema);
