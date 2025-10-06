import { CustomError, UserEntity } from '../../domain';

export class UserMapper {
  static userEntityFromObject(object: { [key: string]: any }): UserEntity {
    const { id, _id, name, email, password, role } = object;
    if (!_id || !id) {
      throw CustomError.badRequest('Invalid object: missing id or _id');
    }

    if (!name) {
      throw CustomError.badRequest('Invalid object: missing name');
    }

    if (!email) {
      throw CustomError.badRequest('Invalid object: missing email');
    }

    if (!role) {
      throw CustomError.badRequest('Invalid object: missing role');
    }

    return new UserEntity(id || _id, name, email, password || '', role);
  }
}
