import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/Route";
import authMiddleware from "../middleware/validateToken";
import userModel from "../schemas/user";
import UserNotFoundException from "../exceptions/UserNotFoundException";

class UserController implements Controller {
  public path = "/user";
  public router = Router();
  private user = userModel;

  // constructor() {
  //   this.initializeRoutes();
  // }

  // private initializeRoutes() {
  //   this.router.get(
  //     `${this.path}/get`,
  //     authMiddleware,
  //     this.getUserWithStables
  //   );
  // }

  // private getUserWithStables = async (
  //   request: RequestWithUser,
  //   response: Response,
  //   next: NextFunction
  // ) => {
  //   const id: string = request.user._id;
  //   const user: UserWithStables = await this.user
  //     .findById(id)
  //     .populate("stables")
  //     .exec();
  //   if (user.stables.length > 0) {
  //     (request.session as any).stableId = user.stables[0]._id;
  //   }
  //   if (user) {
  //     response.send(user);
  //   } else {
  //     next(new UserNotFoundException(id));
  //   }
  // };
}

export default UserController;
