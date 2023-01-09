import { access } from '../helper/createToken.js';
import { sendEmailReset } from '../helper/sendEmail.js';
import { UserModel } from '../Models/UserModels.js';
import env from 'dotenv';
env.config();
const forgotController = async (req, res) => {
  try {
    // GET EMAIL
    const { email } = req.body;
    console.log(email);

    // CHECK EMAIL
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'The email is not already register' });
    console.log(user.id);
    // CREATE AC TOKEN
    const ac_token = access(user);
    // SEND EMAIL
    const url = `${process.env.SERVER_URL}/auth/reset/${ac_token}`;
    const name = user.username;
    sendEmailReset(email, url, 'Reset your password', name);
    // SUCCESS
    return res.status(200).json({ msg: 'Re-send the password, please check your email' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default forgotController;
