import { IsNumber, IsOptional, IsString, IsMongoId } from "class-validator";
import { Schema } from "mongoose";
interface IPost {
  _id?: Schema.Types.ObjectId;
  num?: number;
  subject: string;
  userId?: Schema.Types.ObjectId;
  username?: string;
  ref?: Schema.Types.ObjectId;
  body: string;
}

export default class Post implements IPost {
  @IsOptional()
  @IsMongoId()
  public _id: Schema.Types.ObjectId;
  @IsOptional()
  @IsNumber()
  public num?: number;
  @IsString()
  public subject: string;
  @IsOptional()
  @IsMongoId()
  public userId?: Schema.Types.ObjectId;
  @IsOptional()
  public username?: string;
  @IsOptional()
  @IsMongoId()
  public ref?: Schema.Types.ObjectId;
  @IsString()
  public body: string;
}
