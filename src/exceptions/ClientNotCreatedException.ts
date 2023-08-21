import HttpException from './HttpException';

class ClientNotCreatedException extends HttpException {
  constructor(id: string) {
    super(403, `user with id ${id} failed to create client`);
  }
}

export default ClientNotCreatedException;
