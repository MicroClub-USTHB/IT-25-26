import type { ICacheService } from '../../interfaces.js';
import type { CacheEntry, CacheStats } from '../../types.js';

export class LocalCacheProvider implements ICacheService {
  private store = new Map<string, CacheEntry>();
  private timers = new Map<string, NodeJS.Timeout>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    keys: 0,
  };

  constructor(public defaultTimeout: number = 5 * 60 * 1000) {} // default 5 minutes

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async get(key: string): Promise<CacheEntry | null> {
    const entry = this.store.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry;
  }

  async set(
    key: string,
    value: any,
    timeout = this.defaultTimeout,
  ): Promise<void> {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    const entry: CacheEntry = {
      value,
      expiresAt: Date.now() + timeout,
    };

    this.store.set(key, entry);
    this.stats.keys = this.store.size;

    if (timeout) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, timeout);

      this.timers.set(key, timer);
    }
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }

    this.stats.keys = this.store.size;
  }

  async clear(): Promise<void> {
    this.store.clear();

    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.stats.keys = 0;
  }

  // Returns structured stats
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Prints full cache state
  dump(): void {
    console.log('------------------------');
    console.log('Cache State:');
    console.log('------------------------');

    for (const [key, entry] of this.store.entries()) {
      console.log({
        key,
        expiresAt: entry.expiresAt
          ? new Date(entry.expiresAt).toISOString()
          : 'never',
      });
    }

    console.log('------------------------');
    console.log('Stats:', this.getStats());
  }

  clearTimers(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
}
