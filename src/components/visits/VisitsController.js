const ClientService = require('../clients/ClientsService');
const AccountService = require('../accounts/old/AccountsService');
const VisitService = require('./VisitsService');

class VisitsController {
  async getVisitList(req, res, next) {
    try {
      const account = await AccountService.getAccount(req.userData.userId, 'clients', '_id name surname phone age');
      const client = await ClientService.getClient(account, req.params.clientId);
      const visit = await VisitService.getVisitList(client);
      res.status(200).json(visit);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getVisit(req, res, next) {
    try {
      const account = await AccountService.getAccount(req.userData.userId, 'clients');
      const client = await ClientService.getClient(account, req.params.clientId);
      const visit = await VisitService.getVisit(client, req.params.visitId);
      res.status(200).json(visit);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addVisit(req, res, next) {
    try {
      const account = await AccountService.getAccount(req.userData.userId, 'clients');
      const client = await ClientService.getClient(account, req.params.clientId);
      const result = await VisitService.addVisit(client, req.body);
      res.status(201).json({ message: 'Visit added successfully', result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateVisit(req, res, next) {
    try {
      const result = await ClientService.updateVisit(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async removeVisit(req, res, next) {
    try {
      const result = await ClientService.removeVisit(req);
      res.status(200).json({ message: 'Visit removed successfully', result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new VisitsController();
