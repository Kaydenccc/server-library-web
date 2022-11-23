import { google } from 'googleapis';
import { refresh } from '../helper/createToken.js';
import { UserModel } from '../Models/UserModels.js';
import env from 'dotenv';
env.config();
import bcrypt from 'bcrypt';
const { OAuth2 } = google.auth;
const googleController = async (req, res) => {
  try {
    // get token id
    const { tokenId } = req.body;
    // verify token id
    const client = new OAuth2(process.env.G_CLIENT_ID);
    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.G_CLIENT_ID,
    });
    // get data
    const { email_verified, email, name, picture } = verify.payload;
    // failed verification
    if (!email_verified) return res.status(400).json({ msg: 'Email verification failed.' });
    //passed verification
    const user = await UserModel.findOne({ email });
    // if user exist / sign in
    if (user) {
      const rf_token = refresh(user);
      //store cookie
      res.cookie('rf_token', rf_token, {
        httpOnly: true,
        path: '/api/auth/v1/access',
        maxAge: 24 * 60 * 60 * 1000, //24h
      });
      res.status(200).json({ msg: 'sign in with google success' });
    } else {
      // new user / create user
      const password = email + process.env.G_CLIENT_ID;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        image: picture,
        profesi: req.body.profesi,
        nomor_hp: req.body.nomor_hp,
        alamat: req.body.alamat,
        dipinjam: [],
        admin: false,
      });
      await newUser.save();
      // sign in the user
      const rf_token = refresh(user);
      //store cookie
      res.cookie('rf_token', rf_token, {
        httpOnly: true,
        path: '/api/auth/v1/access',
        maxAge: 24 * 60 * 60 * 1000, //24h
      });
      // success
      res.status(200).json({ msg: 'Sign in with google success.' });
    }
    //success
  } catch (err) {
    if (err) return res.status(500).json({ msg: err.message });
  }
};

export default googleController;
