import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();
export const genToken = (payload) => {
  //GENERATE TOKEN
  return jwt.sign({ _id: payload.id }, process.env.SECRET_TOKEN, { expiresIn: '5m' });
};
export const refresh = (payload) => {
  //REFRESH TOKEN
  return jwt.sign({ _id: payload.id }, process.env.REFRESH_TOKEN, { expiresIn: '24h' });
};
export const access = (payload) => {
  //ACCESS TOKEN
  return jwt.sign({ _id: payload.id }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
};
