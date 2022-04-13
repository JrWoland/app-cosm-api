// import { verify } from 'jsonwebtoken';
// import APP_CONFIG from '../../localSettings';

const { verify } = require('jsonwebtoken');
const APP_CONFIG = require('../../localSettings');

const checkAuth = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.signedCookies.access_token;
    const decoded = verify(token, APP_CONFIG.default.JWT_KEY);
    req.userData = decoded;
    req.accountId = decoded.accountId._uniqueEntityId.id;
    req.accountData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth failed. Login first.',
    });
  }
};

module.exports = checkAuth;
