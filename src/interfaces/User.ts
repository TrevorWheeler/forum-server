import * as mongoose from "mongoose";

export default interface User extends mongoose.Document {
  username: string;
  password: string;
}
