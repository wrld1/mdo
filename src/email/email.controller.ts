import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import EmailService from './email.service';
import { Public } from 'src/common/decorators/public';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
