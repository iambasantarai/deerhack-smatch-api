import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  socials: any;

  @IsOptional()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  founded: string;

  @IsNotEmpty()
  @IsString()
  employeeNumber: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  hrName: string;

  @IsNotEmpty()
  @IsString()
  hrEmail: string;

  @IsNotEmpty()
  @IsString()
  industry: string;

  // Include additional fields if needed
}

export const createCompanySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    password: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 1 },
    website: { type: 'string' },
    socials: { type: 'any' },
    logo: {
      type: 'file',
      format: 'binary',
    },
    founded: { type: 'string' },
    employeeNumber: { type: 'string' },
    phone: { type: 'string' },
    hrName: { type: 'string' },
    hrEmail: { type: 'string', format: 'email' },
    industry: { type: 'string' },
  },
  required: [
    'name',
    'password',
    'address',
    'founded',
    'employeeNumber',
    'phone',
    'hrName',
    'hrEmail',
    'industry',
  ],
};
