const ClientService = require('../services/ClientService')

class VisitsController {
    async getVisitList(req, res, next) {
        try {
            const result = await ClientService.getVisitList(req)
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getVisit(req, res, next) {
        try {
            const visit = await ClientService.getVisit(req)
            if (!visit.length) return res.status(404).json({ message: 'Visit not found' });
            res.status(200).json(visit[0]);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async addVisit(req, res, next) {
        try {
            const result = await ClientService.addVisit(req)
            res.status(200).json({ message: 'Visit added successfully', result });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateVisit(req, res, next) {
        const result = await ClientService.updateVisit(req)
        res.status(200).json(result);
    }

    async removeVisit(req, res, next) {
        try {
            const result = await ClientService.removeVisit(req)
            res.status(200).json({ message: 'Visit removed successfully', result });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new VisitsController()