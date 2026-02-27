import express from 'express';
import {
  createUserByAdmins,
  deleteUser,
  getAllUsers,
  getProfile,
  login,
  logout,
  registerSuperAdmin,
} from '../controller/Auth.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register-super-admin', registerSuperAdmin);
router.post('/create-user', auth, createUserByAdmins);
router.post('/login', login);
router.get('/logout', logout);
router.get('/user-info', auth, getProfile);
router.get('/all-users', auth, getAllUsers);
router.get('/delete-user/:userId', auth, deleteUser);

export default router;
