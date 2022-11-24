const signOut = async (req, res) => {
  try {
    // clear cookie
    res.clearCookie('_apprftoken', { path: '/api/auth/v1/access' });
    //success
    return res.status(200).json({ msg: 'Signout success' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export default signOut;
