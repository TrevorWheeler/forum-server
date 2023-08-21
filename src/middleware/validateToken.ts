import { NextFunction, Response, Request } from "express";

import dotenv from "dotenv";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import User from "interfaces/User";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import config from "../config";
import userModel from "../schemas/user";
dotenv.config();

async function validateToken(req: Request, res: Response, next: NextFunction) {
  req.query.userId = undefined;
  req.query.username = undefined;
  const token = req.headers.authorization.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, config.secret) as User;
      if (!decoded._id) {
        req.query.username = decoded.username;
        next();
      } else {
        const user: User = await userModel.findById(decoded._id);
        if (user) {
          req.query.userId = user._id;
          next();
        } else {
          next(new WrongAuthenticationTokenException());
        }
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}
export default validateToken;
