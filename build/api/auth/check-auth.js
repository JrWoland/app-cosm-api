"use strict";
var jwt = require('jsonwebtoken');
var APP_CONFIG = require('../../localSettings.js');
module.exports = function (req, res, next) {
    try {
        var token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, APP_CONFIG.JWT_KEY);
        req.userData = decoded;
        req.accountData = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'Auth failed. Login first.',
        });
    }
};
