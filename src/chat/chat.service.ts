import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  create(createChatDto: CreateChatDto) {
    return {
      query: createChatDto.query,
      answer: 'Hi, How may i help you?',
    };
  }
}
