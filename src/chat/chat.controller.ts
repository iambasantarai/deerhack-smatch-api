import { Controller, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':companyId/ask')
  create(
    @Param('companyId') companyId: string,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.create(companyId, createChatDto);
  }
}
