const mongsoose = require('mongoose');
const User = require('./UsersModel');

class UserService {
  async getUser(email) {
    try {
      const user = await User.find({ email }).exec()
      return user
    } catch (error) {
      throw new Error(error.message)
    }
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