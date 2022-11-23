import express from 'express';
import { addLog, getLogs, updatelog, deletelog, searchlog, getLogById, paginationLogs } from '../Controllers/logController.js';
const router = express.Router();

router.post('/log/book', addLog);
router.get('/log/books', getLogs);
router.get('/log/pagination', paginationLogs);
router.get('/log/book/:id', getLogById);
router.put('/log/book/:id', updatelog);
router.delete('/log/book/:id', deletelog);
router.get('/log/search/:search', searchlog);

export default router;
