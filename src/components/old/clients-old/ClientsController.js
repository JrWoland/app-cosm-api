const AccountService = require('../accounts-old/AccountsService');
const ClientService = require('./ClientsService');

class ClientController {
  async getClientsList(req, res) {
    try {
      const { userId } = req.userData;
      const clientList = await ClientService.getClientsList(userId);
      res.status(200).json(clientList);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getClient(req, res) {
    try {
      const { userId } = req.userData;
      const { clientId } = req.params;
      const client = await ClientService.getClient(userId, clientId);
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addClient(req, res) {
    try {
      const { userId } = req.userData;
      const { body } = req;
      const client = await ClientService.addClient(userId, body);
      res.status(200).json({ message: 'Succesfully added client', result: client });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateClient(req, res) {
    try {
      const account = await AccountService.getAccount(req.userData.userId, 'clients');
      await ClientService.updateClient(account, req.params.clientId, req.body);
      res.status(200).json({ message: 'Succesfully updated client', success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async removeClient(req, res, next) {
    try {
      const { userId } = req.userData;
      const { clientId } = req.params;
      const result = await ClientService.removeClient(userId, clientId);
      res.status(200).json({ message: 'Succesfully removed client', success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ClientController();
