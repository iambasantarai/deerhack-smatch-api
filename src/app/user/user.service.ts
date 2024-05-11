import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      select: ['id', 'name', 'email', 'phone', 'avatar'],
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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobsApplied'],
    });
    const jobs = user.jobsApplied.filter((job) => job.status === 'applied');
    return { user, jobs };
  }
}
