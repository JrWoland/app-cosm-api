import * as express from 'express';
export interface DecodedExpressReq extends express.Request {
  accountId: string;
}
