import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JobStatus, UserJob } from './entities/userJob.entity';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserJob)
    private userJobRepository: Repository<UserJob>,
  ) {}
  async createUser(userDetails: any) {
    const user = await this.userRepository.save(userDetails);
    return { userid: user.id };
  }

  findAll() {
    return `This action returns all user`;
  }
  // ! pachi remove return type
  findOneUsersByID(id: number): any {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'avatar', 'cv'],
    });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'phone', 'avatar'],
    });
  }
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async sessionUser(user: any) {
    return user;
  }

  async userDashboard(id: number) {
    // const jobsApplied = await this.userJobRepository.count({
    //   where: { user: { id }, status: JobStatus.APPLIED },
    // });
    // group by status and count using  uery builder
    const jobs = await this.userJobRepository
      .createQueryBuilder('userJob')
      .select('userJob.status', 'status')
      .addSelect('COUNT(userJob.status)', 'count')
      .where('userJob.user = :id', { id })
      //   userJob.status equlas to status
      .groupBy('userJob.status')
      .getRawMany();
    console.log({ jobs });
    return { jobs };
  }
  async updateUser(user: CreateAuthDto, userId: number) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.update({ id: userId }, user);
  }
}
