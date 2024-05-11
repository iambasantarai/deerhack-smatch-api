import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatOpenAI } from '@langchain/openai';
import { createOpenAIToolsAgent } from 'langchain/agents';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AgentExecutor } from 'langchain/agents';
import { AIMessage } from '@langchain/core/messages';
import { DataSource } from 'typeorm';
import { SqlDatabase } from 'langchain/sql_db';
import { dbCredentials } from 'src/utils/env.util';
import { SqlToolkit } from 'langchain/agents/toolkits/sql';

@Injectable()
export class ChatService {
  async getQueryResponse(companyId: string, query: string) {
    const datasource = new DataSource({
      type: 'postgres',
      host: dbCredentials.host,
      port: dbCredentials.port,
      username: dbCredentials.username,
      password: dbCredentials.password,
      database: dbCredentials.database,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      includesTables: ['company'],
    });

    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
    });

    const sqlToolKit = new SqlToolkit(db, model);

    const tools = sqlToolKit.getTools();

    const SQL_PREFIX = `You are an agent designed to interact with a SQL database.
    Given an input question, create a syntactically correct {dialect} query to fetch information from the row with id {companyId}, then look at the results of the query and return the answer.
    You can order the results to return the most informative data in the database.
    You have access to tools for interacting with the database.
    Only use the given tools. Only use the information returned by the tools to construct your final answer.
    You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

    DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

    If the question does not seem related to the database table, just return "Sorry. I don't have enough knowledge to help you." as the answer.

    If the final answer is like 'The company with ID x' where x is id, just curate this answer by
    EXCLUDING the sensetive information like ID, and unnecessary information like logo from the final answer.
    `;

    const SQL_SUFFIX = `Begin!

    Question: {input}
    Thought: I should look at the table in the database to answer the question.
    {agent_scratchpad}`;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SQL_PREFIX],
      HumanMessagePromptTemplate.fromTemplate('{input}'),
      new AIMessage(SQL_SUFFIX.replace('{agent_scratchpad}', '')),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const newPrompt = await prompt.partial({
      dialect: sqlToolKit.dialect,
      companyId,
    });

    const runnableAgent = await createOpenAIToolsAgent({
      llm: model,
      tools,
      prompt: newPrompt,
    });

    const agentExecutor = new AgentExecutor({
      agent: runnableAgent,
      tools,
    });

    const result = await agentExecutor.invoke({
      input: query,
    });

    return result.output;
  }

  async create(companyId: string, createChatDto: CreateChatDto) {
    const { query } = createChatDto;

    const response = await this.getQueryResponse(companyId, query);

    return {
      response,
    };
  }
}
