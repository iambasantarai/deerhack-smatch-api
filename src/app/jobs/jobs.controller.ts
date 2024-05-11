import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator';
import { jobListQuery } from './dto/jobLIst.dto';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Public()
  @Get()
  findAll(@Query() params: jobListQuery) {
    return this.jobsService.findAllJob({
      page: params.page,
      take: params.take,
    });
  }

  @Public()
  @Get('seeder')
  seeder() {
    return this.jobsService.seeder();
  }
}
