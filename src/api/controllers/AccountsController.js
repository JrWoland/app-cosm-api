const AccountService = require('../services/AccountService')
const ClientService = require('../services/ClientService')

class AccountsController {
    async getAccount(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId)
            res.status(200).json(account);
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async getClientsList(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId, 'clients', '_id name surname phone age')
            const clientList = ClientService.getClientsList(account)
            res.status(200).json(clientList)
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async getClient(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId, 'clients')
            const client = await ClientService.getClient(account, req.params.clientId)
            res.status(200).json(client);
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async addClient(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId, 'clients')
            const client = await ClientService.addClient(account, req.body)
            res.status(200).json({ message: 'Succesfully added client', result: client });
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async updateClient(req, res) {
        try {
            const account = await AccountService.getAccount(req.userData.userId, 'clients')
            await ClientService.updateClient(account, req.params.clientId, req.body)
            res.status(200).json({ message: 'Succesfully updated client', success: true });
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }

    async removeClient(req, res, next) {
        try {
            const account = await AccountService.getAccount(req.userData.userId, 'clients')
            const result = await ClientService.removeClient(account, req.params.clientId)
            res.status(200).json({ message: 'Succesfully removed client', result });
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
    }
}

module.exports = new AccountsController()