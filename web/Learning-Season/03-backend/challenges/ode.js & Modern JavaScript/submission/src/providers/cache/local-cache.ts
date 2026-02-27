import type { ICacheService } from '../../interfaces.js';

export class LocalCacheProvider implements ICacheService {
  private store: Map<string, any> = new Map();

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async get<T>(key: string): Promise<T | null> {
    return (this.store.get(key) as T) || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }
}
