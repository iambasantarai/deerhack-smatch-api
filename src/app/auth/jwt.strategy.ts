import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { env } from 'src/utils/env.util';
import { CompanyService } from '../company/company.service';

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    if (payload.type === 'user') {
      const user = await this.userService.findUserByEmail(payload.email);
      // ! pachi
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        type: 'user',
        avatar: user.avatar,
      };
    } else if (payload.type === 'company') {
      const company = await this.companyService.findfromEmail(payload.email);
      // ! pachi
      return {
        id: company.CompanyId,
        email: company.hrEmail,
        phone: company.phone,
        name: company.name,
        type: 'company',
        avatar: company.logo,
      };
    }
  }
}
