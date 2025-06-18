
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private attempts = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    // Clean up expired entries periodically
    this.cleanup();

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
        blocked: false
      });
      return true;
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      return false;
    }

    // Check if exceeded max attempts
    if (entry.count >= this.config.maxAttempts) {
      entry.blocked = true;
      entry.blockUntil = now + this.config.windowMs;
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getAttemptsLeft(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.config.maxAttempts;
    }
    return Math.max(0, this.config.maxAttempts - entry.count);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime && (!entry.blockUntil || now > entry.blockUntil)) {
        this.attempts.delete(key);
      }
    }
  }
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 60
});

export const passwordResetRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3
});

export { RateLimiter };
