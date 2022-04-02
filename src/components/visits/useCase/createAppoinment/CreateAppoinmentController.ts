import { BaseController } from '../../../../core/infra/BaseController';
import { CreateAppoinmentDTO } from './CreateAppoinmentDTO';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';
import * as express from 'express';

interface DecodedReq extends express.Request {
  accountId: string;
}
export class CreateAppoinmentController extends BaseController {
  constructor(private useCase: CreateAppoinmentUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(req: DecodedReq): Promise<any> {
    const newAppoinmentDTO: CreateAppoinmentDTO = this.req.body;

    newAppoinmentDTO.accountId = req.accountId;

    try {
      const result = await this.useCase.execute(newAppoinmentDTO);

      if (result.isSuccess) {
        this.created(result.getValue());
      } else {
        this.unprocesable(result.error);
      }
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
