import { UserModel } from '../Models/UserModels.js';

export const info = async (req, res) => {
  try {
    // get info password
    const user = await UserModel.findById(req.user._id).select('-password');
    console.log(req.user.id);
    //success
    return res.status(200).json({ user });
  } catch (err) {
    if (err) return res.status(500).json({ msg: err.message });
  }
};
