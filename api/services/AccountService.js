const mongsoose = require('mongoose');
const Account = require('../models/accountModel');

class AccountService {
    async createAccount(user) {
        const account = new Account({
            _id: mongsoose.Types.ObjectId(),
            owner: user,
        })
        const result = await account.save()
        return result
    }

    async getAccount(userId, populate, select = '') {
        const account = await Account
            .find({ owner: mongsoose.Types.ObjectId(userId) })
            .populate(populate, select)
            .exec()
        return account[0]
    }

    updateAccount() { }

    deleteAccount() { }

}

module.exports = new AccountService()