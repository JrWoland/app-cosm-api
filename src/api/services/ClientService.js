const mongsoose = require('mongoose');
const Client = require('../models/clientModel');

class ClientService {
    getClientsList(account) {
        try {
            return account.clients
        } catch (error) {
            throw new Error(error)
        }
    }

    getClient(account, clientId) {
        try {
            const client = account.clients.find(item => item._id.toString() === clientId)
            if(!client) throw new Error('Client does not exist.')
            return client
        } catch (error) {
            throw new Error(error)
        }
    }

    async addClient(account, body) {
        try {
            const client = new Client({
                _id: mongsoose.Types.ObjectId(),
                name: body.name,
                surname: body.surname,
                phone: body.phone,
                age: body.age,
            })
            await client.save()
            account.clients.push(client)
            await account.save()
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateClient(account, clientId, body) {
        const updatedClient = {
            name: body.name,
            surname: body.surname,
            phone: body.phone,
            age: body.age
        }
        const client = this.getClient(account, clientId)
        try {
            await Client
                .updateOne( //using updateOne we can update only specific values
                    {
                        _id: client._id
                    },
                    {
                        $set: Object.assign(client, updatedClient) 
                    },
                    {
                        runValidators: true
                    }
                ).exec()
        } catch (error) {
            throw new Error(error)
        }
    }

    async removeClient(account, clientId) {
        try {
            const client = this.getClient(account, clientId)
            //remove from account array
            account.clients.pull(client._id)
            await account.save()
            // remove from collection
            await Client.findByIdAndRemove(client._id).exec()
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new ClientService()