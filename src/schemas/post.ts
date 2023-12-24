// import Post from "../interfaces/Post";
import * as mongoose from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

const postSchema = new mongoose.Schema(
  {
    num: {
      type: Number,
    },
    subject: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    username: {
      type: String,
    },
    ref: {
      type: mongoose.Schema.Types.ObjectId,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: false,
    versionKey: false,
  }
);
postSchema.plugin(AutoIncrementID, { field: "num", startAt: 1 });

const postModel = mongoose.model<any>("Post", postSchema);
export default postModel;
