import HttpException from "./HttpException";

class UsernameAlreadyTakenException extends HttpException {
  constructor() {
    super(400, `Username already taken`);
  }
}

export default UsernameAlreadyTakenException;
