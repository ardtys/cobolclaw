export interface Token {
	id: string;
	name: string;
	ticker: string;
	address: string;
	age: number; // seconds since deployment
	mcap: number;
	volume5m: number;
	holders: number;
	status: TokenStatus;
	price: number;
	supply: number;
	liquidity: number;
	bondcurveProgress: number; // 0-100
	deployer: string;
	deployTime: number; // timestamp
	createdAt: number; // timestamp
}

export type TokenStatus = 'HOT' | 'WARM' | 'COOL' | 'DEAD';

export function getStatusDisplay(status: TokenStatus): string {
	switch (status) {
		case 'HOT':
			return '██';
		case 'WARM':
			return '█░';
		case 'COOL':
			return '░░';
		case 'DEAD':
			return '▓▓';
	}
}

export function getStatusClass(status: TokenStatus): string {
	switch (status) {
		case 'HOT':
			return 'status-hot';
		case 'WARM':
			return 'status-warm';
		case 'COOL':
			return 'status-cool';
		case 'DEAD':
			return 'status-dead';
	}
}

export function formatAge(seconds: number): string {
	if (seconds < 60) return `${seconds}s`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
	return `${Math.floor(seconds / 86400)}d`;
}

export function formatMcap(mcap: number): string {
	if (mcap >= 1000000) return `$${(mcap / 1000000).toFixed(2)}M`;
	if (mcap >= 1000) return `$${(mcap / 1000).toFixed(1)}K`;
	return `$${mcap.toFixed(0)}`;
}

export function formatVolume(volume: number): string {
	if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
	if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
	return `$${volume.toFixed(0)}`;
}
