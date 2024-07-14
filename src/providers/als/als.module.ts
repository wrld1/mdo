import { Module } from '@nestjs/common';
import { AsyncLocalStorageProvider } from './als.provider';

@Module({
  providers: [AsyncLocalStorageProvider],
  exports: [AsyncLocalStorageProvider],
})
export class AsyncLocalStorageModule {}
