const jwt = require('jsonwebtoken');
const APP_CONFIG = require('../../localSettings.js');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, APP_CONFIG.JWT_KEY);
    req.userData = decoded;
    req.accountData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth failed. Login first.',
    });
  }
};
