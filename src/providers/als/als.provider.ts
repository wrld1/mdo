import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncLocalStorageProvider {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  run(store: Map<string, any>, callback: () => void) {
    this.storage.run(store, callback);
  }

  getStore(): Map<string, any> {
    return this.storage.getStore();
  }

  set(key: string, value: any) {
    const store = this.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string): any {
    const store = this.getStore();
    return store ? store.get(key) : undefined;
  }
}
