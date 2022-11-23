import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: 'https://res.cloudinary.com/diqsivizd/image/upload/v1668267193/LIBRARY/user_image/pngegg_qhoull.png',
    },
    email: {
      type: String,
      require: true,
    },
    admin: Boolean,
    password: {
      type: String,
      require: true,
      min: 6,
    },
    nim: {
      type: String,
      required: true,
    },
    angkatan: {
      type: String,
      required: true,
    },
    profesi: {
      type: String,
      required: true,
    },

    nomor_hp: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('UserAuth', UserSchema);
