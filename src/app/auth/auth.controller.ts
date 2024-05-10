import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginAuthDto,
  createSchema,
} from './dto/create-auth.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginDetails: LoginAuthDto) {
    return this.authService.login(loginDetails);
  }
  @Post('register')
  @ApiConsumes('multipart/form-data')
  /*
  name
  bio
  email
  phone
  profilePic
  password
  confirmPassword
cv:pdf file upload
address

*/
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePic', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: createSchema,
  })
  registerUser(
    @Body() registerDetails: CreateAuthDto,
    // @UploadedFile({
    //   name: 'profilePic',
    // })
    // profilePic: Express.Multer.File,
    // @UploadedFile({
    //   name: 'cv',
    // })
    @UploadedFiles()
    image: Express.Multer.File[],
  ) {
    return this.authService.register(registerDetails, image as any);
  }
}
