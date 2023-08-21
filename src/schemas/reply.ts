import Reply from "../interfaces/Reply";
import * as mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    content: {
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
    timestamps: true,
    versionKey: false,
  }
);

const replyModel = mongoose.model<Reply>("Reply", replySchema);
export default replyModel;

module.exports = mongoose.model("Reply", replySchema);
