const APP_CONFIG = require('../../localSettings.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AccountService = require('./AccountsService');

class AccountsController {
  async getAccount(req, res) {
    try {
      const account = await AccountService.getAccount(req.accountData.email);
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createAccount(req, res, next) {
    try {
      const { email, password } = req.body;
      const account = await AccountService.getAccount(email);

      if (account.length >= 1) return res.status(422).json({ message: 'Email adress already exists.', success: false });

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: 'Error occured while creating new user',
            error: err,
            success: false,
          });
        } else {
          try {
            await AccountService.createAccount(email, hash);
            res.status(201).json({ message: 'Account created.', email, success: true });
          } catch (err) {
            res.status(500).json({
              message: 'Error occured while saving new account in database',
              error: err.message,
              success: false,
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        message: 'Create account service unavailable',
        error: err.message,
        success: false,
      });
    }
  }

  async login(req, res, next) {
    try {
      const account = await AccountService.getAccount(req.body.email);
      if (account.length < 1) return res.status(401).json({ message: 'Auth failed.' });

      bcrypt.compare(req.body.password, account[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed because of database error',
            error: err,
            success: false,
          });
        }
        if (result) {
          const ACCOUNT = {
            email: account[0].email,
            accountId: account[0]._id,
          };
          const token = jwt.sign(ACCOUNT, APP_CONFIG.JWT_KEY, {
            expiresIn: APP_CONFIG.JWT_EXPIRES_IN,
          });
          res.status(200).json({ message: 'Auth succesfull', token, success: true });
          return;
        }
        res.status(401).json({ message: 'Auth failed by now', success: false });
      });
    } catch (err) {
      res.status(500).json({
        message: 'Login service unavailable',
        error: err.message,
        success: false,
      });
    }
  }

  async resetPassword(req, res, next) {
    //need to implement email service first
    res.status(200).json({ message: 'Not resetPassword implemented' });
  }

  async logout(req, res, next) {
    res.status(200).json({ message: 'Not logout implemented' });
  }

  async deleteAccount(req, res, next) {
    try {
      const { accountData } = req;
      console.log('', accountData);
      res.status(200).json({ message: 'Not delete implemented' });
    } catch (error) {}

    res.status(200).json({ message: 'Not deleteAccount implemented' });
  }

  async updateEmail(req, res, next) {
    res.status(200).json({ message: 'Not updateEmail implemented' });
  }

  async updatePassword(req, res, next) {
    res.status(200).json({ message: 'Not updatePassword implemented' });
  }
}

module.exports = new AccountsController();
