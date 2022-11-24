import jwt from 'jsonwebtoken';
import { access } from '../helper/createToken.js';
import env from 'dotenv';
env.config();
const accessController = async (req, res) => {
  try {
    //rf token
    const rf_token = req.cookies?._apprftoken;
    if (!req.cookies?._apprftoken) return res.status(400).json({ msg: 'Please sign in first.' });
    //validate
    jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Please sign in again.' });
      // create access token
      const ac_token = access(user);
      // access success
      return res.status(200).json({ ac_token });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default accessController;
