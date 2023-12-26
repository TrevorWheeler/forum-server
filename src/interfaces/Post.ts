import { Schema } from "mongoose";
import Joi from "joi";
export interface Post {
  _id?: Schema.Types.ObjectId;
  num?: number;
  subject: string;
  userId?: Schema.Types.ObjectId;
  username?: string;
  ref?: Schema.Types.ObjectId;
  body: string;
}

export const postValidation = Joi.object({
  _id: Joi.string().hex().length(24).optional(),
  // post number - incremented on DB save
  num: Joi.number().optional(),
  subject: Joi.string().min(2).max(100).required().messages({
    "string.base": `"subject" should be a type of 'text'`,
    "string.empty": `"subject" cannot be an empty field`,
    "string.min": `"subject" should have a minimum length of {#limit}`,
    "string.max": `"subject" should have a maximum length of {#limit}`,
    "any.required": `"subject" is a required field`,
  }),
  // For when user has account
  userId: Joi.string().hex().length(24).optional(),
  // For when user does not have an account.
  username: Joi.string(),
  // reference to parent post
  ref: Joi.string().hex().length(24).optional(),
  // The content body of the post.
  body: Joi.string(),

  media: Joi.string(),
  url: Joi.string(),
});

export interface PostCreate {
  subject: string;
  media: string;
  url: string;
  body: string;
}

export const postCreateSchema = Joi.object<PostCreate>({
  subject: Joi.string().required().min(3).max(100).messages({
    "string.base": `Subject should be a type of 'text'`,
    "string.empty": `Subject cannot be an empty field`,
    "string.min": `Subject should have a minimum length of {#limit}`,
    "string.max": `Subject should have a maximum length of {#limit}`,
    "any.required": `Subject is a required field`,
  }),
  url: Joi.string().required(),
  media: Joi.string().required(),
  body: Joi.string().required().min(10).messages({
    "string.base": `Body should be a type of 'text'`,
    "string.empty": `Body cannot be an empty field`,
    "string.min": `Body should have a minimum length of {#limit}`,
    "any.required": `Body is a required field`,
  }),
}).required();

export interface PostReply {
  ref: string;
  body: string;
}

export const postReplySchema = Joi.object({
  // reference to parent post
  ref: Joi.string().hex().length(24).optional().messages({
    "string.base": `"ref" should be a type of 'text'`,
    "string.empty": `"ref" cannot be an empty field`,
    "string.hex": `"ref" should only contain 'Hexadecimal' numbers`,
    "string.length": `"ref" should have a length of {#limit}`,
    "any.required": `"ref" is a required field`,
  }),
  // The content body of the post.
  body: Joi.string(),
});
