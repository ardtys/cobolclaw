import type { Token } from '$lib/types/token';

export interface CachedToken {
	data: Token;
	expiry: number;
}

export class TokenCache {
	private cache = new Map<string, CachedToken>();
	private readonly TTL: number; // Time to live in milliseconds
	private readonly MAX_SIZE = 1000; // Maximum cache entries

	constructor(ttlSeconds: number = 30) {
		this.TTL = ttlSeconds * 1000;
	}

	/**
	 * Get token from cache
	 */
	get(address: string): Token | null {
		const cached = this.cache.get(address);

		if (!cached) {
			return null;
		}

		// Check if expired
		if (Date.now() > cached.expiry) {
			this.cache.delete(address);
			return null;
		}

		return cached.data;
	}

	/**
	 * Set token in cache
	 */
	set(address: string, data: Token): void {
		// Clean old entries if cache is too large
		if (this.cache.size >= this.MAX_SIZE) {
			this.cleanOldest();
		}

		this.cache.set(address, {
			data,
			expiry: Date.now() + this.TTL
		});
	}

	/**
	 * Set multiple tokens
	 */
	setMany(tokens: Token[]): void {
		tokens.forEach((token) => {
			this.set(token.address, token);
		});
	}

	/**
	 * Check if token exists and is not expired
	 */
	has(address: string): boolean {
		const cached = this.cache.get(address);

		if (!cached) {
			return false;
		}

		if (Date.now() > cached.expiry) {
			this.cache.delete(address);
			return false;
		}

		return true;
	}

	/**
	 * Get multiple tokens
	 */
	getMany(addresses: string[]): Map<string, Token> {
		const result = new Map<string, Token>();

		addresses.forEach((address) => {
			const token = this.get(address);
			if (token) {
				result.set(address, token);
			}
		});

		return result;
	}

	/**
	 * Clear specific token
	 */
	delete(address: string): void {
		this.cache.delete(address);
	}

	/**
	 * Clear all cache
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache size
	 */
	get size(): number {
		return this.cache.size;
	}

	/**
	 * Clean expired entries
	 */
	cleanExpired(): void {
		const now = Date.now();
		const toDelete: string[] = [];

		this.cache.forEach((cached, address) => {
			if (now > cached.expiry) {
				toDelete.push(address);
			}
		});

		toDelete.forEach((address) => this.cache.delete(address));
	}

	/**
	 * Clean oldest entries when cache is full
	 */
	private cleanOldest(): void {
		// Remove 10% of oldest entries
		const toRemove = Math.floor(this.MAX_SIZE * 0.1);
		const entries = Array.from(this.cache.entries());

		// Sort by expiry time (oldest first)
		entries.sort((a, b) => a[1].expiry - b[1].expiry);

		// Remove oldest entries
		for (let i = 0; i < toRemove && i < entries.length; i++) {
			this.cache.delete(entries[i][0]);
		}
	}

	/**
	 * Get cache statistics
	 */
	getStats(): {
		size: number;
		maxSize: number;
		ttlSeconds: number;
		hitRate: number;
	} {
		// Clean expired first
		this.cleanExpired();

		return {
			size: this.cache.size,
			maxSize: this.MAX_SIZE,
			ttlSeconds: this.TTL / 1000,
			hitRate: 0 // Would need hit/miss tracking for real hit rate
		};
	}

	/**
	 * Update TTL for all entries
	 */
	updateTTL(newTTLSeconds: number): void {
		const newTTL = newTTLSeconds * 1000;
		const now = Date.now();

		this.cache.forEach((cached, address) => {
			// Extend expiry proportionally
			const remainingTime = cached.expiry - now;
			const newExpiry = now + Math.max(remainingTime, newTTL);

			this.cache.set(address, {
				...cached,
				expiry: newExpiry
			});
		});
	}
}

/**
 * Global token cache instance (30 second TTL)
 */
export const tokenCache = new TokenCache(30);

/**
 * Audit cache instance (5 minute TTL for audit data)
 */
export const auditCache = new TokenCache(300);
