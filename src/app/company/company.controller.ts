import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  LoginCompanyDto,
  createCompanySchema,
} from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Company, Public } from '../auth/decorator';

@ApiBearerAuth()
@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Public()
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @ApiBody({
    schema: createCompanySchema,
  })
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Public()
  @Post('login')
  loginUser(@Body() loginDetails: LoginCompanyDto) {
    return this.companyService.login(loginDetails);
  }

  @Company()
  @Get('me')
  getMe(@Req() req: any) {
    const { user } = req;
    return this.companyService.getMe(user);
  }
  @Get()
  @Company()
  findAll() {
    return this.companyService.findAll();
  }

  @Get('/company-faker')
  companyFaker() {
    return this.companyService.companyFaker();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
