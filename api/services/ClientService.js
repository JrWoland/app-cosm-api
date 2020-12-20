const mongsoose = require('mongoose');
const Client = require('../models/clientModel');
const Visit = require('../models/visitModel');
const AccountService = require('./AccountService')

class ClientService {
    async getClientsList(userId) {
        const account = await AccountService.getAccount(userId, 'clients', '_id name surname phone age')
        return account.clients
    }

    async getClient(clientId) {
        const client = await Client.findById(clientId)
            .select('_id name surname phone age')
            .exec()
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

    async updateClient(clientId, newData) {
        const client = await Client.updateOne({ _id: clientId }, { $set: newData }, { runValidators: true }).exec()
        return client
    }

    async removeClient({ userData, params }) {
        const account = await AccountService.getAccount(userData.userId)
        account.clients.pull(params.clientId)
        await account.save()
        const client = await Client.findByIdAndRemove(params.clientId).exec()
        return client
    }

    async getVisitList({ params }) {
        const client = await Client.findById(params.clientId)
            .select('visits._id visits.done visits.type visits.purpose visits.date')
            .exec()
        return client.visits
    }

    async getVisit({ params }) {
        const client = await Client.findById(params.clientId).exec()
        const visit = client.visits.filter(item => item._id.toString() === params.visitId)
        return visit
    }

    async addVisit({ params, body }) {
        const client = await Client.findById(params.clientId).exec()
        const visit = new Visit({
            ...body,
            _id: mongsoose.Types.ObjectId()
        })
        client.visits.unshift(visit)
        await client.save()
        return { success: true }
    }

    async updateVisit({ params, body }) {
        const visit = Visit({
            ...body,
            _id: mongsoose.Types.ObjectId(params.visitId)
        })
        const client = await Client
            .findByIdAndUpdate(
                {
                    _id: mongsoose.Types.ObjectId(params.clientId),
                },
                {
                    $set: { 'visits.$[el]': visit }
                },
                {
                    arrayFilters: [{ "el._id": mongsoose.Types.ObjectId(params.visitId) }],
                    new: true,
                    useFindAndModify: false
                }
            ).exec()
        return client
    }

    async removeVisit({ params }) {
        const client = await Client
            .findByIdAndUpdate({ _id: mongsoose.Types.ObjectId(params.clientId) },
                {
                    $pull: { visits: { _id: mongsoose.Types.ObjectId(params.visitId) } }
                }
            ).exec()
        return client.visits.length
    }
}

module.exports = new ClientService()