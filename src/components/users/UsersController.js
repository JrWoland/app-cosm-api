const APP_CONFIG = require('../../localSettings.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserService = require('./UsersService');
const AccountService = require('../accounts/old/AccountsService');
class UserController {
  async createUser(req, res, next) {
    try {
      const user = await UserService.getUser(req.body.email);

      if (user.length >= 1) return res.status(422).json({ message: 'Email adress already exists' });

      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({ message: 'Error occured while creating new user', error: err, success: false });
        } else {
          try {
            const user = await UserService.createUser(req.body.email, hash);
            const account = await AccountService.createAccount(user);
            res.status(201).json({ message: 'User created', result: account, success: true });
          } catch (err) {
            res.status(500).json({ message: 'Error occured while saving new user in database', error: err, success: false });
          }
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Create user service unavailable', error: err.message, success: false });
    }
  }

  async loginUser(req, res, next) {
    try {
      const user = await UserService.getUser(req.body.email);
      if (user.length < 1) return res.status(401).json({ message: 'Auth failed.' });

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Auth failed because of database error', error: err, success: false });
        }
        if (result) {
          const USER = { email: user[0].email, userId: user[0]._id };
          const token = jwt.sign(USER, APP_CONFIG.JWT_KEY, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
          res.status(200).json({ message: 'Auth succesfull', token, success: true });
          return;
        }
        res.status(401).json({ message: 'Auth failed by now' });
      });
    } catch (err) {
      res.status(500).json({ message: 'Login service unavailable', error: err.message, success: false });
    }
  }

  async deleteUser(req, res, next) {
    const id = req.params.userId;

    try {
      const result = await UserService.removeUser(id);
      console.log(result);
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error occured while removing user from database', error });
    }
  }
  //TODO
  updateUser(req, res, next) {}

  //TODO And better place jwt in cookie
  logOutUser(req, res, next) {}
}

module.exports = new UserController();
