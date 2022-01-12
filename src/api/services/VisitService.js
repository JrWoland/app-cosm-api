const mongsoose = require('mongoose');
const Client = require('../models/clientModel');
const Visit = require('../models/visitModel');

class VisitService {
    async getVisitList(clientId) {
        try {
            const client = await Client.findById(clientId)
                .select('visits._id visits.date visits.time visits.done')
                .exec()
            return client.visits
        } catch (error) {
            throw new Error(error)
        }
    }

    async getVisit(client, visitId) {
        try {
            const visit = client.visits.find(item => item._id.toString() === visitId)
            if(!visit) throw new Error('Visit does not exist.')
            return visit
        } catch (error) {
            throw new Error(error)
        }
    }

    async addVisit(client, body) {
        try {
            const visit = new Visit({
                ...body,
                _id: mongsoose.Types.ObjectId()
            })
            client.visits.unshift(visit)
            await client.save()
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateVisit({ params, body }) {
        try {
            const visit = Visit({
                ...body,
                _id: mongsoose.Types.ObjectId(params.visitId)
            })
            await Client
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
        } catch (error) {
            throw new Error(error)
        }
    }

    async removeVisit({ params }) {
        try {
            const client = await Client
                .findByIdAndUpdate({ _id: mongsoose.Types.ObjectId(params.clientId) },
                    {
                        $pull: { visits: { _id: mongsoose.Types.ObjectId(params.visitId) } }
                    }
                ).exec()
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new VisitService()