require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
const app = express();
import morgan from 'morgan';
import serverHeaders from './settings/serverHeaders';
import MORGAN_SETTING_STRING from './settings/morganSettings';

import { routerV1 } from '../server/api/rest-v1';

export class ExpressServer {
  create(serverVersion: number) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(serverHeaders);
    app.use(morgan(MORGAN_SETTING_STRING));

    app.get('/', (req, res) => res.status(200).json({ version: serverVersion }));

    app.use('/uploads/images', express.static('uploads/images'));

    app.use('/api', routerV1);

    app.use((req, res, next) => {
      const error = { message: 'Not found', status: 404 };
      next(error);
    });

    app.use((err: { status: number }, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500);
      res.json({
        message: 'Could not found a proper route',
      });
    });

    return app;
  }
}
