const mongsoose = require('mongoose');
const User = require('../models/userModel');

class UserService {
  async getUser(email) {
    const user = await User.find({ email }).exec()
    return user
  }

  async createUser(email, hash) {
    const user = new User({
      _id: mongsoose.Types.ObjectId(),
      email: email,
      password: hash
    });
    const result = await user.save()
    return result
  }

  async removeUser(id) {
    const result = await User.remove({ _id: id }).exec()
    return result
  }
}

module.exports = new UserService()