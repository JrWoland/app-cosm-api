const AccountService = require('../services/AccountService')
const ClientService = require('../services/ClientService')

class AccountsController {
    async getAccount(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId)
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getClientsList(req, res) {
        try {
            const clientList = await ClientService.getClientsList(req.userData.userId)
            res.status(200).json(clientList)
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getClient(req, res) {
        try {
            const client = await ClientService.getClient(req)
            if (!client) return res.status(404).json({ message: 'Client not found' });
            res.status(200).json(client);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async addClient(req, res) {
        try {
            const client = await ClientService.addClient(req)
            res.status(200).json({ message: 'Succesfully added client', result: client });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateClient(req, res) {
        try {
            const client = await ClientService.updateClient(req.params.clientId, req.body)
            res.status(200).json({ message: 'Succesfully removed client', result: client });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async removeClient(req, res, next) {
        try {
            const result = await ClientService.removeClient(req)
            res.status(200).json({ message: 'Succesfully removed client', result });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new AccountsController()