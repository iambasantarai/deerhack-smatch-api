import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { Public } from './decorator';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Public()
  async login(user: LoginAuthDto) {
    console.log({ user });
    const userDetails = await this.userService.findUserByEmail(user.email);
    if (!userDetails) {
      throw new HttpException('User not found', 404);
    }
    const isMatch = await bcrypt.compare(user.password, userDetails?.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', 401);
    }
    // creating jwt
    const { id, name, email } = userDetails;
    const payload = { id, name, email, type: 'user' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  @Public()
  async register(
    userDetails: CreateAuthDto,
    image: { cv: any; profilePic: any },
  ) {
    const exits = await this.userService.findUserByEmail(userDetails.email);
    if (exits) {
      throw new HttpException('User already exits', HttpStatus.BAD_REQUEST);
    }
    console.log({ userDetails, image });
    const hashedPassword = await this.userService.hashPassword(
      userDetails.password,
    );
    const user = await this.userService.createUser({
      ...userDetails,
      password: hashedPassword,
      avatar: image.profilePic[0].filename,
      cv: image.cv[0].filename,
    });
    return user;
  }
}
