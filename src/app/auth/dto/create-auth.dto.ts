import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches, IsPhoneNumber } from 'class-validator';
export class LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
export const createSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    bio: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    confirmPassword: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    profilePic: {
      type: 'file',
      format: 'binary',
    },
    cv: {
      type: 'file',
      format: 'binary',
    },
  },
};

// create dto from above schema

export class CreateAuthDto {
  @IsNotEmpty()
  name: string;

  bio: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('NP')
  phone: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/, {
    message: `Password must be Minimum eight characters,
       at least one letter and one number`,
  })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  profilePic: string;

  @IsNotEmpty()
  cv: string;
}
