/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number, decimals: number = 2): string {
	return `$${value.toFixed(decimals)}`;
}

/**
 * Format a large number with K/M/B suffixes
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
	const abs = Math.abs(value);

	if (abs >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(decimals)}B`;
	}
	if (abs >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(decimals)}M`;
	}
	if (abs >= 1_000) {
		return `${(value / 1_000).toFixed(decimals)}K`;
	}

	return value.toFixed(decimals);
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 1, showSign: boolean = true): string {
	const sign = showSign && value >= 0 ? '+' : '';
	return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a Solana address (truncate middle)
 */
export function formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
	if (!address || address.length <= startChars + endChars) {
		return address;
	}
	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a timestamp as a relative time string
 */
export function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;
	const seconds = Math.floor(diff / 1000);

	if (seconds < 60) {
		return `${seconds}s AGO`;
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes}m AGO`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}h AGO`;
	}

	const days = Math.floor(hours / 24);
	return `${days}d AGO`;
}

/**
 * Format a date/time in COBOL style
 */
export function formatCobolDateTime(timestamp: number): string {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Pad a string to a specific length
 */
export function padString(str: string, length: number, align: 'left' | 'right' | 'center' = 'left'): string {
	if (str.length >= length) {
		return str.substring(0, length);
	}

	const padding = ' '.repeat(length - str.length);

	if (align === 'right') {
		return padding + str;
	}

	if (align === 'center') {
		const leftPad = Math.floor((length - str.length) / 2);
		const rightPad = length - str.length - leftPad;
		return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
	}

	return str + padding;
}

/**
 * Create a progress bar using block characters
 */
export function createProgressBar(progress: number, length: number = 15): string {
	const filled = Math.round((progress / 100) * length);
	const empty = length - filled;
	return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Create a table row with proper spacing
 */
export function formatTableRow(values: string[], widths: number[]): string {
	return values.map((val, i) => padString(val, widths[i])).join(' ');
}

/**
 * Create a table separator line
 */
export function createTableSeparator(widths: number[]): string {
	return widths.map((width) => '─'.repeat(width)).join(' ');
}

/**
 * Format COIN amount
 */
export function formatCoin(amount: number): string {
	return `${amount.toFixed(4)} COIN`;
}

// Alias for backward compatibility
export const formatSol = formatCoin;

/**
 * Format token amount (handle large numbers with scientific notation)
 */
export function formatTokenAmount(amount: number): string {
	if (amount >= 1_000_000_000) {
		return `${(amount / 1_000_000_000).toFixed(2)}B`;
	}
	if (amount >= 1_000_000) {
		return `${(amount / 1_000_000).toFixed(2)}M`;
	}
	if (amount >= 1_000) {
		return `${(amount / 1_000).toFixed(2)}K`;
	}
	return amount.toFixed(0);
}
