import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorator';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }
  checkadmin = false;
  checkKyc = false;
  request;
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.request = context.switchToHttp().getRequest();
    if (isPublic) {
      return true;
    }
    // const token = context
    //   .switchToHttp()
    //   .getRequest()
    //   .headers.authorization?.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException();
    // }
    // if (isPrivate) {
    //   try {
    //     const secretKey = env.JWT_SECRET;

    //     const data = this.jwtService.verify(token, {
    //       secret: secretKey,
    //     });
    //     if (data) {
    //       return true;
    //     }
    //   } catch (error) {
    //     throw new UnauthorizedException();
    //   }
    // }
    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
