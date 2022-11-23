import fs from 'fs';

export const uploadImageMiddleware = (req, res, next) => {
  // check exits or not
  if (!req.file || !req.body) return res.status(400).json({ msg: 'Issue with uploading this image.' });

  // app use upload
  let image = req.file.path;

  //file type
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
    // rimove file
    fs.unlinkSync(image);
    return res.status(400).json({ msg: 'This file is not supported.' });
  }

  // file size
  if (req.file.size > 1024 * 1024) {
    // rimove file
    fs.unlinkSync(image);
    return res.status(400).json({ msg: 'This file is too large (Max: 1MB).' });
  }
  //success
  next();
};
