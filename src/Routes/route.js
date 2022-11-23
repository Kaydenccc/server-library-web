import express from 'express';
import { addBook, deleteBook, getAllBooks, getBookById, paginationBooks, seachBookByName, updateBook } from '../Controllers/bookController.js';
const router = express.Router();

router.post('/add/book', addBook);
router.get('/get/books', getAllBooks);
router.get('/get/pagination', paginationBooks);
router.get('/get/book/:id', getBookById);
router.get('/get/search/:search', seachBookByName);
router.put('/update/book/:id', updateBook);
router.delete('/delete/book/:id', deleteBook);

export default router;
