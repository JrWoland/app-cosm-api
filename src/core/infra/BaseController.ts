import * as express from 'express';

export abstract class BaseController {
  protected req!: express.Request;
  protected res!: express.Response;
  protected next!: express.NextFunction;

  protected abstract executeImpl(): Promise<void | any>;

  public execute(req: express.Request, res: express.Response, next: express.NextFunction): void {
    this.req = req;
    this.res = res;
    this.next = next;
    this.executeImpl();
  }

  public static jsonResponse(res: express.Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(message?: string) {
    return BaseController.jsonResponse(this.res, 201, message ? message : 'Created');
  }

  public clientError(message?: string) {
    return BaseController.jsonResponse(this.res, 400, message ? message : 'Unauthorized');
  }

  public unauthorized(message?: string) {
    return BaseController.jsonResponse(this.res, 401, message ? message : 'Unauthorized');
  }

  public paymentRequired(message?: string) {
    return BaseController.jsonResponse(this.res, 402, message ? message : 'Payment required');
  }

  public forbidden(message?: string) {
    return BaseController.jsonResponse(this.res, 403, message ? message : 'Forbidden');
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(this.res, 404, message ? message : 'Not found');
  }

  public conflict(message?: string) {
    return BaseController.jsonResponse(this.res, 409, message ? message : 'Conflict');
  }

  public unprocesable(message?: string) {
    return BaseController.jsonResponse(this.res, 422, message ? message : 'Unprocesable entity');
  }

  public tooMany(message?: string) {
    return BaseController.jsonResponse(this.res, 429, message ? message : 'Too many requests');
  }

  public fail(error: Error | string) {
    console.log(error);
    return this.res.status(500).json({
      message: error.toString(),
    });
  }
}
