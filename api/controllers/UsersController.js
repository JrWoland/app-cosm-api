const APP_CONFIG = require('../../localSettings.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserService = require('../services/UserService');
const AccountService = require('../services/AccountService');

class UserController {
  async createUser(req, res, next) {
    const user = await UserService.getUser(req.body.email);

    if (user.length >= 1) return res.status(422).json({ message: 'Email adress already exists' });

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Error occured while creating new user', error: err });
      } else {
        try {
          const user = await UserService.createUser(req.body.email, hash);
          const account = await AccountService.createAccount(user);
          res.status(201).json({ message: 'User created', result: account });
        } catch (err) {
          res.status(500).json({ message: 'Error occured while saving new user in database', error: err });
        }
      }
    });
  }

  async loginUser(req, res, next) {
    const user = await UserService.getUser(req.body.email);

    if (user.length < 1) return res.status(401).json({ message: 'Auth failed' });

    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({ message: 'Auth failed because of database error', error: err });
      }
      if (result) {
        const USER = { email: user[0].email, userId: user[0]._id };
        const token = jwt.sign(USER, APP_CONFIG.JWT_KEY, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
        return res.status(200).json({ message: 'Auth succesfull', token });
      }
      res.status(401).json({ message: 'Auth failed by now' });
    });
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
