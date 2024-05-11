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
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { DataSource } from 'typeorm';
import { SqlDatabase } from 'langchain/sql_db';
import { dbCredentials } from 'src/utils/env.util';
import { SqlToolkit } from 'langchain/agents/toolkits/sql';

@Injectable()
export class ChatService {
  async create(companyId: string, createChatDto: CreateChatDto) {
    const { query } = createChatDto;

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
      includesTables: ['Company'],
    });

    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
    });

    const sqlToolKit = new SqlToolkit(db, model);

    const tools = sqlToolKit.getTools();

    const conversationHistory = [];

    const SQL_PREFIX = `You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
You can order the results by a relevant column to return the most interesting examples in the database.
Query for all the columns from a specific table for most relevant answers.
You have access to tools for interacting with the database.
Only use the given tools. Only use the information returned by the tools to construct your final answer.
You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

If the question does not seem related to the database table, just return "Sorry. I don't have enough knowledge to help you." as the answer.`;

    const SQL_SUFFIX = `Begin!

Question: {input}
Thought: I should look for {companyId} at the table in the database to answer the question.
{agent_scratchpad}`;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SQL_PREFIX],
      HumanMessagePromptTemplate.fromTemplate('{input}, {companyId}'),
      new AIMessage(SQL_SUFFIX.replace('{agent_scratchpad}', '')),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const newPrompt = await prompt.partial({
      dialect: sqlToolKit.dialect,
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
      companyId,
      chat_history: conversationHistory,
    });

    console.log('::: RESULT :::');
    console.log(result);
    console.log('::: RESULT :::');

    conversationHistory.push(new HumanMessage(query));
    conversationHistory.push(new AIMessage(result.output));

    console.log('::: HISTORY :::');
    console.log(conversationHistory);
    console.log('::: HISTORY :::');

    return {
      response: result.output,
    };
  }
}
