import { Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { Public } from './decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  @Public()
  login(createAuthDto: LoginAuthDto) {
    console.log({ createAuthDto });
    return 'This action adds a new auth';
  }

  @Public()
  async register(
    userDetails: CreateAuthDto,
    image: { cv: any; profilePic: any },
  ) {
    console.log({ userDetails, image });
    const user = await this.userService.createUser({
      ...userDetails,
      avatar: image.profilePic[0].filename,
      cv: image.cv[0].filename,
    });
    return user;
  }
}
