import * as mongoose from "mongoose";
import { z } from "zod";
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface User extends mongoose.Document {
  username: string;
  password: string;
}

export const VPost = z.object({
  _id: z.instanceof(ObjectId),
  password: z.string(),
  num: z.number(),
  subject: z.string(),
  userId: z.instanceof(ObjectId),
  username: z.string(),
  ref: z.instanceof(ObjectId).optional(),
  body: z.string(),
});

export type Post = z.infer<typeof VPost>;

export const VCredentials = z.object({
  username: z.string(),
  password: z.string(),
});
export type Credentials = z.infer<typeof VCredentials>;

export const VReplyPost = z.object({
  ref: z.instanceof(ObjectId),
  body: z.string(),
});
export type ReplyPost = z.infer<typeof VReplyPost>;

export const VCreatePost = z.object({
  subject: z.string(),
  body: z.string(),
});
export type CreatePost = z.infer<typeof VCreatePost>;
