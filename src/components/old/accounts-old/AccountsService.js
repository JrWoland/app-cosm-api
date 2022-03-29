const mongsoose = require('mongoose');
const Account = require('./AccountsModel');

class AccountService {
  async createAccount(accountEmail, hashPassword) {
    const account = new Account({
      _id: mongsoose.Types.ObjectId(),
      email: accountEmail,
      password: hashPassword,
    });
    const result = await account.save();
    return result;
  }

  async getAccount(accountEmail) {
    try {
      const account = await Account.find({ email: accountEmail })
        .select('services email _id')
        .exec();
      return account;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  updateAccount() {}

  async deleteAccount(accountId) {
    try {
      const account = await Account.deleteOne({
        _id: mongsoose.Types.ObjectId(accountId),
      }).exec();
      return account;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AccountService();
