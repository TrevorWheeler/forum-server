import { Request, Response, NextFunction, Router } from "express";
import Route from "../interfaces/Route";
import validateToken from "../middleware/validateToken";
import postModel from "../schemas/post";

import mongoose from "mongoose";
import NotFoundException from "../exceptions/NotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import Post from "../interfaces/Post";
class PostRoute implements Route {
  public path = "/post";
  public router = Router();
  private post = postModel;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, validateToken, this.getPosts);
    this.router.post(
      `${this.path}/add`,
      validateToken,
      validationMiddleware(Post),
      this.addPost
    );
    this.router.get(`${this.path}/:id`, validateToken, this.getPost);
    this.router.post(`${this.path}/:id/add`, validateToken, this.addReply);
  }

  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts = await this.post
        .aggregate([
          { $sort: { _id: -1 } },
          { $limit: 250 },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $project: {
              subject: 1,
              _id: 1,
              username: {
                $ifNull: [{ $arrayElemAt: ["$user.username", 0] }, "$username"],
              },
            },
          },
        ])
        .catch((err: any) => console.log(err));
      res.send(posts);
    } catch (e) {
      next(e);
    }
  };

  private addPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const post = await this.post.create({
        userId: req.query.userId ?? undefined,
        subject: req.body.subject ?? undefined,
        username: req.query.username ?? undefined,
        body: req.body.body,
      });
      console.log(post);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.post.aggregate([
        {
          $match: {
            $or: [
              { _id: new mongoose.Types.ObjectId(req.params.id) },
              { ref: new mongoose.Types.ObjectId(req.params.id) },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            body: 1,
            username: {
              $ifNull: [{ $arrayElemAt: ["$user.username", 0] }, "$username"],
            },
          },
        },
      ]);
      res.send(post);
    } catch (e) {
      next(new NotFoundException());
    }
  };

  private addReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const post = await this.post.create({
        ref: new mongoose.Types.ObjectId(req.params.id),
        userId: req.query.userId ?? undefined,
        username: req.query.username ?? undefined,
        body: req.body.body,
      });

      console.log(post);
      res.send(post);
    } catch (e) {
      next(e);
    }
  };
}

export default PostRoute;
