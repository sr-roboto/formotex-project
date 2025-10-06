import { UpdateUserDto } from '../../dtos/auth/update-user.dto';
import { UserEntity } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';

export class UpdateUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(id: string, updateData: UpdateUserDto): Promise<UserEntity> {
    return await this.authRepository.updateUser(id, updateData);
  }
}
