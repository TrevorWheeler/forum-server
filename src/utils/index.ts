// import { z } from "zod";

// export interface User {
//   username: string;
//   password: string;
// }

// export const VPost = z.object({
//   _id: z.string(),
//   num: z.number(),
//   subject: z.string(),
//   userId: z.string(),
//   username: z.string(),
//   ref: z.string(),
//   body: z.string(),
// });

// export type Post = z.infer<typeof VPost>;

// export const VCredentials = z.object({
//   username: z.string(),
//   password: z.string(),
// });
// export type Credentials = z.infer<typeof VCredentials>;

// export const VReplyPost = z.object({
//   ref: z.string(),
//   body: z.string(),
// });
// export type ReplyPost = z.infer<typeof VReplyPost>;

// export const VCreatePost = z.object({
//   subject: z
//     .string()
//     .min(1, { message: "Subject required." })
//     .max(101, { message: "Subject cannot exceed 100 characters." }),
//   body: z.string().min(1, { message: "Body required." }),
// });
// export type CreatePost = z.infer<typeof VCreatePost>;
