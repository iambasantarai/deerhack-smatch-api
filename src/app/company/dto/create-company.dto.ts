import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty({ required: false })
  @IsOptional()
  socials: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  founded: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  employeeNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hrName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hrEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  industry: string;
}

export const createCompanySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'The name of the user',
    },
    bio: {
      type: 'string',
      description: 'The bio of the user',
    },
    email: {
      type: 'string',
      description: 'The email of the user',
    },
    phone: {
      type: 'string',
      description: 'The phone number of the user',
    },
    profilePic: {
      type: 'string',
      format: 'binary',
      description: 'The profile picture of the user',
    },
    password: {
      type: 'string',
      description: 'The password of the user',
    },
    confirmPassword: {
      type: 'string',
      description: 'The password confirmation of the user',
    },
    cv: {
      type: 'string',
      format: 'binary',
      description: 'The CV of the user',
    },
    address: {
      type: 'string',
      description: 'The address of the user',
    },
  },
  required: [
    'name',
    'email',
    'phone',
    'password',
    'confirmPassword',
    'address',
  ],
};
