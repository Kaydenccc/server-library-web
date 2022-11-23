import { UserModel } from '../Models/UserModels.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { access, refresh } from '../helper/createToken.js';

// CONFIG JOI VALIDATION
const Schema = Joi.object({
  email: Joi.string().email().min(6).required(),
  password: Joi.string().email().min(6).required(),
});

export const loginController = async (req, res) => {
  try {
    //VALIDATE BEFORE LOGIN
    const { err } = Schema.validate(req.body);
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) return res.status(400).json({ msg: 'Invalid Email' });
    if (err) return res.status(400).json({ msg: err.details[0].message });
    // CHECK USER ALREADY EXIST OR NOT
    const userData = await UserModel.findOne({ email: req.body.email });
    if (!userData) return res.status(404).json({ msg: 'Email is not already register' });
    //VERIFY PASSWORD
    const isMatch = await bcrypt.compare(req.body.password, userData.password);
    //IF INVALID PASSWORD
    if (!isMatch) return res.status(400).json({ access: false, msg: 'Invalid Password' });
    //IF VALID
    //GENERATE TOKEN
    const rf_token = refresh(userData);
    console.log('refres token: ', rf_token);
    res
      .status(202)
      .cookie('_apprftoken', rf_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/auth/v1/access',
        maxAge: 24 * 60 * 60 * 1000, //24h
      })
      .json({ msg: 'Sign in success' });
  } catch (err) {
    if (err) return res.status(400).json({ msg: err.message });
  }
};
