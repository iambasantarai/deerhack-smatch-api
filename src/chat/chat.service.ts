import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AgentExecutor } from 'langchain/agents';
import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class ChatService {
  async create(createChatDto: CreateChatDto) {
    const { query } = createChatDto;

    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
    });

    const googleSearchTool = new GoogleCustomSearch({
      apiKey: process.env.GOOGLE_API_KEY,
      googleCSEId: process.env.GOOGLE_CSE_ID,
    });
    googleSearchTool.name = 'google_search';
    googleSearchTool.description =
      'useful for when you need to perform web search to answer questions';

    const tools = [googleSearchTool];

    const conversationHistory = [];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a helpful question answering assistant. Your answers sholuld be concise and accurate to avoid any confusion. Avoid providing fabricated information if uncertaion; simply acknowledge the lack of knowledge. ',
      ],
      ['placeholder', '{chat_history}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    const agent = await createToolCallingAgent({
      llm: model,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    const result = await agentExecutor.invoke({
      input: query,
      chat_history: conversationHistory,
    });

    conversationHistory.push(new HumanMessage(query));
    conversationHistory.push(new AIMessage(result.output));

    return {
      response: result.output,
    };
  }
}
