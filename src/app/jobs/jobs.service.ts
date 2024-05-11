import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, jobType } from './entities/job.entity';
import { Repository } from 'typeorm';
import { jobListQuery } from './dto/jobLIst.dto';
import { generateCompanyData } from 'src/faker/faker-script';
import { Company, Industry } from '../company/entities/company.entity';
import { CompanyService } from '../company/company.service';
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly companyService: CompanyService,
  ) {}
  async create(createJobDto: CreateJobDto, companyId) {
    const exits = await this.jobRepository.findOne({
      where: {
        title: createJobDto.title,
        company: {
          CompanyId: companyId,
        },
      },
    });
    if (exits) {
      throw new HttpException('Job already exits', HttpStatus.BAD_REQUEST);
    }
    return this.jobRepository.save({
      ...createJobDto,
      company: { CompanyId: companyId },
    });
  }
  findAllJob(query: jobListQuery) {
    const { page, take } = query;
    let skip;
    if (take) {
      skip = take * (page - 1);
    }
    return this.jobRepository.findAndCount({ skip, take });
  }

  async seeder() {
    const numCompanies = 10; // Change this to the desired number of fake companies
    for (let i = 0; i < numCompanies; i++) {
      const companyData = await this.createJob();
      await this.jobRepository.save(companyData);
    }
  }
  async createJob() {
    const job = new Job();
    job.title = faker.name.jobTitle();
    job.jobDescription = faker.lorem.sentence();
    job.jobType = faker.helpers.enumValue(jobType);
    job.jobLocation = faker.address.city();
    job.jobCategory = faker.helpers.enumValue(Industry);
    job.jobQualification = faker.name.jobArea();
    job.jobExperience = faker.name.jobArea();
    job.jobSalary = faker.name.jobArea();
    //   select from the company table and assign to the job
    job.company = faker.helpers.arrayElement([
      ...(await this.companyService.findAll()),
    ]);

    //   job.company = await generateCompanyData();

    return job;
  }
}
