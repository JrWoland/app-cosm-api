const mongsoose = require('mongoose');
const Client = require('../models/clientModel');
const AccountService = require('./AccountService')

class ClientService {
    async getClientsList(userId) {
        const account = await AccountService.getAccount(userId, 'clients', '_id name surname phone age')
        return account.clients
    }

    async getClient(clientId) {
        const client = await Client.findById(clientId).exec()
        return client
    }

    async addClient({ body, userData }) {
        const client = new Client({
            _id: mongsoose.Types.ObjectId(),
            name: body.name,
            surname: body.surname,
            phone: body.phone,
            age: body.age,
        })
        const result = await client.save()
        const account = await AccountService.getAccount(userData.userId)
        account.clients.push(client)
        await account.save()
        return result
    }

    updateClient(clientId, newData) {

        console.log(clientId, newData, 'client  update');

        // const update = {};


        // for (const property in newData) {
        //     // update[property] = property.value;
        // }

    }

    async removeClient({ userData, params }) {
        const account = await AccountService.getAccount(userData.userId)
        account.clients.pull(params.clientId)
        await account.save()
        const client = await Client.findByIdAndRemove(params.clientId).exec()
        return client
    }

    getVisitList() { }

    getVisit(visitId) { }

    addVisit(visit) { }

    updateVisit(visitId) { }

    removeVisit(visitId) { }
}

module.exports = new ClientService()