import User from "interfaces/User";
import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: {
      type: String,
      get: (): undefined => undefined,
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

// Ensure virtual fields are serialised.
// userSchema.set("toJSON", {
//   virtuals: true,
// });

// userSchema.virtual("posts", {
//   ref: "Posts",
//   localField: "_id",
//   foreignField: "userId",
// });

const userModel = mongoose.model<User>("User", userSchema);
export default userModel;
