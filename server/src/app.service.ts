import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello, Document signer server is running at http://localhost:${process.env.PORT || 10517}`;
  }
}
