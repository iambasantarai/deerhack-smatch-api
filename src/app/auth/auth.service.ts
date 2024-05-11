import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { Public } from './decorator';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import axios from 'axios';
import { env } from 'src/utils/env.util';
import { createReadStream } from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
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
    // const categoryData = await this.fetchUserCategory(image.cv[0].filename);
    const user = await this.userService.createUser({
      ...userDetails,
      password: hashedPassword,
      avatar: image.profilePic[0].filename,
      cv: image.cv[0].filename,
    });
    return user;
  }

  async fetchUserCategory(cvPath) {
    // const cvFile = createReadStream(join(process.cwd(), `/uploads/${user.cv}`));
    const cvFilePath = join(process.cwd(), `/uploads/${cvPath}`);
    const formData = new FormData();
    formData.append('file', createReadStream(cvFilePath));
    console.log(`${env.AI_URL}predict/`);
    try {
      const response = await axios.post(`${env.AI_URL}predict/`, formData, {
        headers: {
          ...formData.getHeaders(), // This automatically sets the correct content-type header
        },
      });

      return response.data.category;
    } catch (error) {
      // Handle error
      console.error('Error:', error.message);
    }
  }
}
