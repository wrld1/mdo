import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncLocalStorageProvider {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  get store(): Map<string, any> {
    return this.storage.getStore();
  }

  run(fn: () => void, store: Map<string, any> = new Map()) {
    this.storage.run(store, fn);
  }
}
