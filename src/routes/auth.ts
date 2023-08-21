import { Request, Response, NextFunction, Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Route from "../interfaces/Route";
import validationMiddleware from "../middleware/validation.middleware";
import userModel from "../schemas/user";
import Credentials from "../interfaces/Credentials";
import UsernameAlreadyTakenException from "../exceptions/UsernameAlreadyTakenException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import config from "../config";
class AuthRoute implements Route {
  public path = "/auth";
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user`, this.getPublicUser);
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(Credentials),
      this.registration
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(Credentials),
      this.validateCredentials
    );
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: Credentials = request.body;
    try {
      if (await this.user.findOne({ username: userData.username })) {
        next(new UsernameAlreadyTakenException());
        return;
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        username: userData.username,
        password: hashedPassword,
      });

      const token: string = this.generateToken(user.username, user._id);
      response.send(token);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private validateCredentials = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const credentials: Credentials = request.body;
      const user = await this.user.findOne({ username: credentials.username });
      if (!user) {
        next(new WrongCredentialsException());
        return;
      }
      const authenticated = await bcrypt.compare(
        credentials.password,
        user.get("password", null, { getters: false })
      );
      if (!authenticated) {
        next(new WrongCredentialsException());
      }
      const token: string = this.generateToken(user.username, user._id);
      response.send(token);
    } catch (e) {
      console.error(e);
    }
  };

  private getPublicUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const hash = await bcrypt.hash("username", 10);
      // remove / && . chars
      const cleanHash: string = hash.replace(/\/|\./g, "");
      const username: string = cleanHash.slice(-8);
      const token: string = this.generateToken(username, undefined);
      response.send(token);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private generateToken(username: string, _id?: string): string {
    const expiresIn: number = 60 * 60;
    return jwt.sign({ _id, username }, process.env.SECRET, { expiresIn });
  }
}

export default AuthRoute;