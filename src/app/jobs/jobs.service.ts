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
import { UserService } from '../user/user.service';
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async create(createJobDto: CreateJobDto, companyId) {
    const exits = await this.jobRepository.findOne({
      where: {
        title: createJobDto.title,
        company: {
          id: companyId,
        },
      },
    });
    if (exits) {
      throw new HttpException('Job already exits', HttpStatus.BAD_REQUEST);
    }
    return this.jobRepository.save({
      ...createJobDto,
      company: { id: companyId },
    });
  }
  async findAllJob(query: jobListQuery) {
    const { page, take } = query;
    let skip;
    if (take) {
      skip = take * (page - 1);
    }
    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .skip(skip)
      .take(take)
      .select([
        'job.id',
        'job.title',
        'job.jobDescription',
        'job.jobType',
        'job.jobLocation',
        'job.jobCategory',
        'job.jobQualification',
        'job.jobExperience',
        'job.jobSalary',
        'company.id',
        'company.name',
        'company.logo',
      ])
      .getManyAndCount();

    // return this.jobRepository.findAndCount({
    //   skip,
    //   take,
    //   relations: ['company'],
    // });
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
    job.jobExperience = `${faker.helpers.rangeToNumber({
      min: 1,
      max: 5,
    })} years`;
    job.jobSalary = faker.number
      .int({
        min: 10000,
        max: 200000,
      })
      .toString();
    //   select from the company table and assign to the job
    job.company = faker.helpers.arrayElement([
      ...(await this.companyService.findAll()),
    ]);

    //   job.company = await generateCompanyData();

    return job;
  }
  async findOne(jid) {
    return this.jobRepository.findOne({
      where: { id: jid },
      relations: ['company'],
    });
  }
  async applyJob(body, userId) {
    const job = await this.jobRepository.findOne({
      where: { id: body.jobId },
      relations: ['users'],
    });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.findOneUsersByID(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    job.users.push(user);
    return this.jobRepository.save(job);
  }
}
