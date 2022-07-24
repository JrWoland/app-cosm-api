import express from 'express';

import { accountRouter } from '../../../components/accounts/AccountsApi';
import { appoinmentRouter } from '../../../components/appointment/VisitApi';
import { clientRouter } from '../../../components/clients/ClientApi';
// import clientsApi from '../../api/components/clients/ClientsApi';
// import visitsApi from '../../api/components/visits/VisitsApi';

const routerV1 = express.Router();

routerV1.use('/account', accountRouter);
routerV1.use('/appointment', appoinmentRouter);
routerV1.use('/clients', clientRouter);
// routerV1.use('/clients', clientsApi);
// routerV1.use('/visits', visitsApi);

export { routerV1 };
