import { writable, derived } from 'svelte/store';

export interface RPCStatus {
	isConnected: boolean;
	isUsingFallback: boolean;
	failureCount: number;
	lastError: string | null;
	lastSuccessTime: number;
}

class RPCErrorHandler {
	private failureCount = 0;
	private isUsingFallback = false;
	private lastError: string | null = null;
	private lastSuccessTime = Date.now();
	private readonly MAX_FAILURES = 3;
	private readonly TIMEOUT_MS = 5000;

	// Svelte store for reactive status
	private statusStore = writable<RPCStatus>({
		isConnected: true,
		isUsingFallback: false,
		failureCount: 0,
		lastError: null,
		lastSuccessTime: Date.now()
	});

	/**
	 * Execute function with fallback on error
	 */
	async withFallback<T>(
		realDataFn: () => Promise<T>,
		mockDataFn: () => T,
		errorMessage: string = 'RPC Error'
	): Promise<T> {
		try {
			// Race between real data fetch and timeout
			const result = await Promise.race([
				realDataFn(),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error('RPC Timeout')), this.TIMEOUT_MS)
				)
			]);

			// Success - reset failure counter
			this.onSuccess();
			return result;
		} catch (error) {
			// Failure - increment counter and handle
			this.onFailure(errorMessage, error);

			// Use fallback if failures exceed threshold
			if (this.failureCount >= this.MAX_FAILURES) {
				console.warn(`Using fallback after ${this.failureCount} failures`);
				return mockDataFn();
			}

			// Otherwise throw to retry
			throw error;
		}
	}

	/**
	 * Handle successful RPC call
	 */
	private onSuccess(): void {
		this.failureCount = 0;
		this.isUsingFallback = false;
		this.lastError = null;
		this.lastSuccessTime = Date.now();
		this.updateStatus();
	}

	/**
	 * Handle failed RPC call
	 */
	private onFailure(message: string, error: any): void {
		this.failureCount++;
		this.lastError = `${message}: ${error?.message || 'Unknown error'}`;

		if (this.failureCount >= this.MAX_FAILURES) {
			this.isUsingFallback = true;
		}

		console.error(this.lastError);
		this.updateStatus();
	}

	/**
	 * Update status store
	 */
	private updateStatus(): void {
		this.statusStore.set({
			isConnected: !this.isUsingFallback,
			isUsingFallback: this.isUsingFallback,
			failureCount: this.failureCount,
			lastError: this.lastError,
			lastSuccessTime: this.lastSuccessTime
		});
	}

	/**
	 * Get current status
	 */
	getStatus(): RPCStatus {
		return {
			isConnected: !this.isUsingFallback,
			isUsingFallback: this.isUsingFallback,
			failureCount: this.failureCount,
			lastError: this.lastError,
			lastSuccessTime: this.lastSuccessTime
		};
	}

	/**
	 * Get status store (reactive)
	 */
	get status() {
		return derived(this.statusStore, ($status) => $status);
	}

	/**
	 * Manually reset error state
	 */
	reset(): void {
		this.failureCount = 0;
		this.isUsingFallback = false;
		this.lastError = null;
		this.updateStatus();
	}

	/**
	 * Check if currently using fallback
	 */
	get usingFallback(): boolean {
		return this.isUsingFallback;
	}

	/**
	 * Get failure count
	 */
	get failures(): number {
		return this.failureCount;
	}
}

/**
 * Singleton instance
 */
export const rpcErrorHandler = new RPCErrorHandler();

/**
 * RPC error codes
 */
export const RPC_ERRORS = {
	TIMEOUT: 'E-5001',
	RATE_LIMIT: 'E-5002',
	INVALID_RESPONSE: 'E-5003',
	NETWORK_ERROR: 'E-5004'
} as const;

/**
 * Format RPC error for display
 */
export function formatRPCError(code: string, details?: string): string {
	const messages: Record<string, string> = {
		'E-5001': 'RPC CONNECTION TIMEOUT',
		'E-5002': 'RPC RATE LIMIT EXCEEDED',
		'E-5003': 'INVALID RPC RESPONSE',
		'E-5004': 'NETWORK ERROR'
	};

	const message = messages[code] || 'UNKNOWN RPC ERROR';
	return details ? `${message}: ${details}` : message;
}
