import { Request, Response, NextFunction, RequestHandler } from "express";
import HttpException from "../exceptions/HttpException";

export function validate(schema: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validate(req.body);
      next();
    } catch (e) {
      console.log(e);
      next(new HttpException(400, "Bad Request."));
    }
  };
}
