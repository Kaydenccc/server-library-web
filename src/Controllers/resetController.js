import { UserModel } from '../Models/UserModels.js';
import bcrypt from 'bcrypt';

const resetController = async (req, res) => {
  try {
    // get password
    const { password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    UserModel.findById(req.user._id, (err, user) => {
      if (err) return res.status(400).json({ msg: err.message });
      const data = {
        ...user._doc,
        password: hashPassword,
      };

      // update password
      UserModel.findByIdAndUpdate(user.id, data, (err, datalama) => {
        if (err) return res.status(500).json({ msg: err.message });
        // reset seccess
        res.status(200).json({ msg: 'Password was update successfully.' });
      });
    });
  } catch (err) {
    if (err) return res.status(500).json({ msg: err.message });
  }
};

export default resetController;
