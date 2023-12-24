import { Request, Response, NextFunction, Router } from "express";
import Route from "../interfaces/Route";
import validateToken from "../middleware/validateToken";
import postModel from "../schemas/post";

import mongoose from "mongoose";
import NotFoundException from "../exceptions/NotFoundException";
import { validate } from "../middleware/validate";
import {
  type Post,
  postValidation,
  type PostReply,
  postReplySchema,
} from "../interfaces/Post";

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
      validate(postValidation),
      this.addPost
    );
    this.router.get(`${this.path}/:id`, validateToken, this.getPost);
    this.router.post(
      `${this.path}/:id/add`,
      validateToken,
      validate(postReplySchema),
      this.addReply
    );
  }

  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts = await this.post.aggregate([
        {
          $match: { ref: { $exists: false } },
        },
        {
          $lookup: {
            from: "posts",
            let: { mainThreadId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$ref", "$$mainThreadId"] },
                  subject: { $exists: false },
                },
              },
              {
                $sort: { _id: -1 },
              },
              {
                $limit: 1,
              },
              {
                $project: {
                  _id: 1,
                },
              },
            ],
            as: "latestReply",
          },
        },
        {
          $unwind: {
            path: "$latestReply",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "latestReply._id": -1 },
        },
        {
          $limit: 250,
        },
      ]);
      res.send(posts);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private addPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.post.create({
        userId: req.query.userId ?? undefined,
        subject: req.body.subject ?? undefined,
        username: req.query.username ?? undefined,
        body: req.body.body,
      });
      // console.log(post);

      // console.log(await this.isImage("https://www.google.com"));
      // res.send({ _id: post._id.toString() });
      res.send({ _id: post._id.toString() });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  private isImage = async (url: string) => {
    try {
      const res = await fetch(url);
      console.log(res);
      const buff = await res.blob();

      return buff.type.startsWith("image/");
    } catch (e) {
      console.log(e);
      return false;
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
