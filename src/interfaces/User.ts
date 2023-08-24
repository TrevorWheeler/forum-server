import * as mongoose from "mongoose";

export default interface User extends mongoose.Document {
  // _id: string;
  username: string;
  password: string;
}
