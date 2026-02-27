import type { ICacheService } from '../../interfaces.js';

export class FileCacheProvider implements ICacheService {
  // to be implemented: read/write from filesystem
  async has(key: string): Promise<boolean> {
    throw new Error('FileCacheProvider not implemented');
  }

  async get<T>(key: string): Promise<T | null> {
    throw new Error('FileCacheProvider not implemented');
  }

  async set<T>(key: string, value: T): Promise<void> {
    throw new Error('FileCacheProvider not implemented');
  }
}
