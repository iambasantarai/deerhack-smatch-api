import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHeartBeat(): object {
    const hrtime = process.hrtime.bigint().toString();
    return { heartbeat: hrtime };
  }
}
