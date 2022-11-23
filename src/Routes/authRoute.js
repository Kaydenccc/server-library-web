import express from 'express';
import accessController from '../Controllers/accessController.js';
import forgotController from '../Controllers/forgotController.js';
import googleController from '../Controllers/googleController.js';
import { info } from '../Controllers/info.js';
import { loginController } from '../Controllers/loginController.js';
import { getUsers, registerController, deleteUser, updateUser, getUsersById, seachUserByName, paginationUsers } from '../Controllers/registerController.js';
import resetController from '../Controllers/resetController.js';
import signOut from '../Controllers/signOut.js';
import auth from '../middleware/auth.js';
const router = express.Router();

//ROUTES
router.post('/register', registerController);
router.post('/login', loginController);
router.get('/access', accessController);
router.post('/forgot-password', forgotController);
router.put('/reset-password', auth, resetController);
router.put('/google_signin', googleController);
router.get('/users', getUsers);
router.get('/users/pagination', paginationUsers);
router.get('/user', auth, info);
router.get('/user/:id', getUsersById);
router.get('/signout', signOut);
router.put('/user/:id', updateUser);
router.get('/search/:search', seachUserByName);
router.delete('/user/:id', deleteUser);

export default router;
