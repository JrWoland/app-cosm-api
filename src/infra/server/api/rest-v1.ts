import express from 'express';

import { accountRouter } from '../../../components/accounts/AccountsApi';
// import clientsApi from '../../api/components/clients/ClientsApi';
// import visitsApi from '../../api/components/visits/VisitsApi';

const routerV1 = express.Router();

routerV1.use('/account', accountRouter);
// routerV1.use('/clients', clientsApi);
// routerV1.use('/visits', visitsApi);

export { routerV1 };
