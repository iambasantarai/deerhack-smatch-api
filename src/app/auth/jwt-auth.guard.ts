import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_COMPANY_KEY, IS_PUBLIC_KEY } from './decorator';
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
  isCompany;
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.isCompany = this.reflector.getAllAndOverride<boolean>(IS_COMPANY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.request = context.switchToHttp().getRequest();
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (this.isCompany) {
      if (user.type !== 'company') {
        throw new UnauthorizedException();
      }
    }

    return user;
  }
}
