import { IsString } from "class-validator";
interface ICredentials {
  username: string;
  password: string;
}

export default class Credentials implements ICredentials {
  @IsString()
  public username: string;
  @IsString()
  public password: string;
}
