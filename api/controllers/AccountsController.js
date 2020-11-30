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
            console.log(clientList);
            res.status(200).json({ clients: clientList })
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getClient(req, res) {
        try {
            const client = await ClientService.getClient(req.params.clientId)
            if (!client) return res.status(404).json({ message: 'Client not found' });
            res.status(200).json({ client });
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
        const client = await ClientService.updateClient(req.params.clientId, req.body)
        res.status(200).json({ message: 'Feature not yet implemented' });
    }

    async removeClient(req, res, next) {
        try {
            const result = await ClientService.removeClient(req)
            res.status(200).json({ message: 'Succesfully deleted client', result });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    getVisitList(req, res, next) {
        res.status(200).json({ message: 'Feature not yet implemented' });
    }

    getVisit(req, res, next) {
        res.status(200).json({ message: 'Feature not yet implemented' });
    }

    addVisit(req, res, next) {
        res.status(200).json({ message: 'Feature not yet implemented' });
    }

    updateVisit(req, res, next) {
        res.status(200).json({ message: 'Feature not yet implemented' });
    }

    removeVisit(req, res, next) {
        res.status(200).json({ message: 'Feature not yet implemented' });
    }
}

module.exports = new AccountsController()