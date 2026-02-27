import type { ICacheService } from '../../interfaces.js';
import type { CacheStats } from '../../types.js';

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

  async delete(key: string): Promise<void> {
    throw new Error('FileCacheProvider not implemented');
  }

  async clear(): Promise<void> {
    throw new Error('FileCacheProvider not implemented');
  }

  getStats(): CacheStats {
    throw new Error('FileCacheProvider not implemented');
  }

  dump() {
    throw new Error('FileCacheProvider not implemented');
  }
}
