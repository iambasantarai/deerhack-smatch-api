import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  findMe(@Req() req: any) {
    const { user } = req;
    return this.userService.sessionUser(user);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUsersByID(+id);
  }

  @Get('/dashboard')
  userDashboard(@Req() req: any) {
    const { user } = req;
    return this.userService.userDashboard(user.id);
  }
}
