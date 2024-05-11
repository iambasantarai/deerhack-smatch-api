import { Controller, Post, Body, Req, Get, Query, Patch } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Company, Public } from '../auth/decorator';
import { applyJobDto, jobListQuery } from './dto/jobLIst.dto';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.jobsService.create(createJobDto, req.user.id);
  }
  @Company()
  @Patch('/update')
  update(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.jobsService.updateJob(createJobDto, req.user.id);
  }
  @Public()
  @Get()
  findAll(@Query() params: jobListQuery) {
    return this.jobsService.findAllJob({
      page: params.page,
      take: params.take,
    });
  }

  @Post('apply-job')
  applyJob(@Body() body: applyJobDto, @Req() req: any) {
    return this.jobsService.applyJob(body, req.user.id);
  }
  //   @Get('/analyze/:jid')
  //   analyze(@Req() req: any, @Query('jid') jid: string) {
  //     return this.jobsService.analyze(req.user.id, jid);
  //   }

  @Get('/applied-jobs')
  async appliedJobs(@Req() req: any, @Query() params: jobListQuery) {
    return this.jobsService.appliedJobs(req.user.id, {
      page: params.page,
      take: params.take,
    });
  }
  @Public()
  @Get('seeder')
  seeder() {
    return this.jobsService.seeder();
  }
  @Company()
  @Get('/company-jobs')
  companyJobs(@Req() req: any, @Query() params: jobListQuery) {
    return this.jobsService.companyJobList(req.user.id, {
      page: params.page,
      take: params.take,
    });
  }
  @Company()
  @Get('/company-job/:id')
  companyJob(@Req() req: any, @Query('id') id: string) {
    return this.jobsService.companyJob(req.user.id, id);
  }
  @Public()
  @Get('/:id')
  findOne(@Req() req: any) {
    return this.jobsService.findOne(req.params.id);
  }
}
