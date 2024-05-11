import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JobStatus, UserJob } from './entities/userJob.entity';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { Chroma } from '@langchain/community/vectorstores/chroma';
// import { HuggingFaceInference } from '@langchain/community/llms/hf';
// import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';

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

  async ingestAndEvaluateMyResume(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const loader = new PDFLoader(`./uploads/${user.cv}`);

    const documents = await loader.load();

    const QA_PROMPT_TEMPLATE = `Use the following pieces of context to answer the question at the end.
    You are a helpful assistant in completing questions using given piceces of context before answering.
    The answers should be very descriptive and accurate.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    {context}
    Question: {question}
    Helpful Answer:`;

    function normalizeDocuments(documents) {
      return documents.map((document) => {
        if (typeof document.pageContent === 'string') {
          return document.pageContent;
        } else if (Array.isArray(document.pageContent)) {
          return document.pageContent.join('\n');
        }
      });
    }

    // const model = new HuggingFaceInference({
    //   model: 'deepset/roberta-base-squad2',
    //   apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    // });

    const model = new OpenAI({
      model: 'gpt-3.5-turbo',
      apiKey: process.env.OPENAI_API_KEY,
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const normalizedDocs = normalizeDocuments(documents);
    const splitDocs = await textSplitter.createDocuments(normalizedDocs);

    // const embeddings = new HuggingFaceInferenceEmbeddings({
    //   apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    // });

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const uniqueCollectionName = user.id.toString() + '-' + Date.now();

    const vectorStore = await Chroma.fromDocuments(splitDocs, embeddings, {
      collectionName: uniqueCollectionName ?? 'default-collection',
      url: process.env.CHROMA_URL,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      prompt: PromptTemplate.fromTemplate(QA_PROMPT_TEMPLATE),
    });

    const response = await chain.call({
      query:
        'This is my resume, Is there any thing i can improve on ? If there please provide your feedbacks where i can improve on.',
    });

    return response.text;
  }
}
