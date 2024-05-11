import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatOpenAI } from '@langchain/openai';
import { createSqlQueryChain } from 'langchain/chains/sql_db';
import { PromptTemplate } from '@langchain/core/prompts';
import { DataSource } from 'typeorm';
import { SqlDatabase } from 'langchain/sql_db';
import { dbCredentials } from 'src/utils/env.util';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { QuerySqlTool } from 'langchain/tools/sql';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';

@Injectable()
export class ChatService {
  datasource = new DataSource({
    type: 'postgres',
    host: dbCredentials.host,
    port: dbCredentials.port,
    username: dbCredentials.username,
    password: dbCredentials.password,
    database: dbCredentials.database,
  });

  model = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0,
  });

  async getQueryResponse(query: string) {
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: this.datasource,
      includesTables: ['company', 'job'],
    });

    const executeQuery = new QuerySqlTool(db);
    const writeQuery = await createSqlQueryChain({
      llm: this.model,
      db,
      dialect: 'sqlite',
    });

    const answerPrompt =
      PromptTemplate.fromTemplate(`Given the following user question, corresponding SQL query, and SQL result, answer the user question.

    Question: {question}
    SQL Query: {query}
    SQL Result: {result}
    Answer: `);

    const answerChain = answerPrompt
      .pipe(this.model)
      .pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      RunnablePassthrough.assign({ query: writeQuery }).assign({
        result: (i: { query: string }) => executeQuery.invoke(i.query),
      }),
      answerChain,
    ]);

    const answer = await chain.invoke({ question: query });

    return answer;
  }

  async create(createChatDto: CreateChatDto) {
    const { query } = createChatDto;

    const response = await this.getQueryResponse(query);

    return {
      response,
    };
  }
}
