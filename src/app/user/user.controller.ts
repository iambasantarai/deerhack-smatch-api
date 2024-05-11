import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateAuthDto, createSchema } from '../auth/dto/create-auth.dto';

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

  @Get('/dashboard')
  userDashboard(@Req() req: any) {
    const { user } = req;
    return this.userService.userDashboard(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUsersByID(+id);
  }

  @Patch('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePic', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: createSchema,
  })
  update(@Req() req: any, @Body() editUser: CreateAuthDto) {
    const { user } = req;
    return this.userService.updateUser(editUser, user.id);
  }

  @Get('evaluate-my-resume')
  evaluateMyrResume(@Req() req: any) {
    const { user } = req;
    return this.userService.ingestAndEvaluateMyResume(user.id);
  }
}
