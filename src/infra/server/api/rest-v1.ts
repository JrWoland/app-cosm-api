import express from 'express';

import { accountRouter } from '../../../components/accounts/AccountsApi';
import { appoinmentRouter } from '../../../components/visit/AppointmentApi';
import { clientRouter } from '../../../components/clients/ClientApi';
import { treatmentRouter } from '../../../components/visit/TreatmentApi';
// import clientsApi from '../../api/components/clients/ClientsApi';
// import visitsApi from '../../api/components/visits/VisitsApi';

const routerV1 = express.Router();

routerV1.use('/account', accountRouter);
routerV1.use('/appointment', appoinmentRouter);
routerV1.use('/client', clientRouter);
routerV1.use('/treatment', treatmentRouter);
// routerV1.use('/clients', clientsApi);
// routerV1.use('/visits', visitsApi);

export { routerV1 };
