const mongsoose = require('mongoose');
const Client = require('./ClientsModel');

const AccountsService = require('../accounts/old/AccountsService');

class ClientService {
  async getClientsList(userId) {
    try {
      const account = await AccountsService.getAccount(userId, 'clients', '_id name surname phone age');
      return account.clients;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getClient(userId, clientId) {
    try {
      const account = await AccountsService.getAccount(userId, 'clients', '_id name surname phone age');
      const client = account.clients.find((item) => item._id.toString() === clientId);
      if (!client) throw new Error('Client does not exist.');
      return client;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addClient(userId, body) {
    try {
      const account = await AccountsService.getAccount(userId, 'clients');
      const client = new Client({
        _id: mongsoose.Types.ObjectId(),
        name: body.name,
        surname: body.surname,
        phone: body.phone,
        age: body.age,
      });
      await client.save();
      account.clients.push(client);
      await account.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateClient(account, clientId, body) {
    const updatedClient = {
      name: body.name,
      surname: body.surname,
      phone: body.phone,
      age: body.age,
    };
    const client = this.getClient(account, clientId);
    try {
      await Client.updateOne(
        //using updateOne we can update only specific values
        {
          _id: client._id,
        },
        {
          $set: Object.assign(client, updatedClient),
        },
        {
          runValidators: true,
        },
      ).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeClient(userId, clientId) {
    try {
      const account = await AccountsService.getAccount(userId, 'clients', '_id');
      const client = account.clients.find((item) => item._id.toString() === clientId);
      if (!client) throw new Error('Client does not exist.');
      //remove from account array
      account.clients.pull(client._id);
      await account.save();
      // remove from collection
      await Client.findByIdAndRemove(client._id).exec();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ClientService();
