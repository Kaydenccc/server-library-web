import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();
const auth = (req, res, next) => {
  try {
    // check ac token
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Authentication field' });
    // validate
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) res.status(400).json({ msg: 'Authentication feild' });
      // success
      console.log('user', user);
      console.log('token', token);
      req.user = user;
      next();
    });
  } catch (err) {
    if (err) return res.status(500).json({ msg: err.message });
  }
};

export default auth;
