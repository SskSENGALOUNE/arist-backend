import { UpdateProfileData } from '../../../domain/user/user.repository';

export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateProfileData,
  ) {}
}
