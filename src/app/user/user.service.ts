import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  createUser(userDetails: any) {
    return this.userRepository.save(userDetails);
  }

  findAll() {
    return `This action returns all user`;
  }
  // ! pachi remove return type
  findOneUsersByID(id: number): any {
    return `This action returns a #${id} user`;
  }

  findUserByEmail(email: string) {
    return `This action returns a user with email ${email}`;
  }
}
