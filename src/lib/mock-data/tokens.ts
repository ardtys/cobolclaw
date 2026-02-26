import type { Token, TokenStatus } from '$lib/types/token';

// Mock token name prefixes and suffixes for generation
const prefixes = [
	'DOGE',
	'CAT',
	'PEPE',
	'SHIB',
	'FLOKI',
	'WOJAK',
	'ELON',
	'MOON',
	'LASER',
	'ROCKET',
	'DIAMOND',
	'GOLDEN',
	'MEGA',
	'GIGA',
	'ULTRA',
	'SUPER',
	'TURBO',
	'HYPER',
	'CYBER',
	'QUANTUM'
];

const suffixes = [
	'COIN',
	'TOKEN',
	'CASH',
	'MOON',
	'INU',
	'SWAP',
	'FINANCE',
	'PROTOCOL',
	'NETWORK',
	'CHAIN',
	'AI',
	'BOT',
	'DAO',
	'9000',
	'420',
	'69',
	'KING',
	'GOD',
	'ARMY',
	'SQUAD'
];

const memes = [
	'DOGWIFHAT',
	'BONK',
	'SAMO',
	'COPE',
	'GMERICA',
	'WAGMI',
	'NGMI',
	'HODL',
	'YOLO',
	'FOMO',
	'DIAMOND_HANDS',
	'PAPER_HANDS',
	'MOON_BOY',
	'RUG_MASTER',
	'DEGEN_KING'
];

/**
 * Generate a random token name
 */
function generateTokenName(): string {
	const useMemeName = Math.random() < 0.3;

	if (useMemeName) {
		return memes[Math.floor(Math.random() * memes.length)];
	}

	const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
	const useNumber = Math.random() < 0.4;

	if (useNumber) {
		const number = Math.floor(Math.random() * 9000) + 1000;
		return `${prefix}${number}`;
	}

	return `${prefix}${suffix}`;
}

/**
 * Generate a random ticker
 */
function generateTicker(name: string): string {
	// Take first 2-4 letters of name
	const length = Math.min(4, Math.max(2, Math.floor(Math.random() * 3) + 2));
	let ticker = name.substring(0, length);

	// Sometimes add a number
	if (Math.random() < 0.2) {
		ticker += Math.floor(Math.random() * 9);
	}

	return `$${ticker}`;
}

/**
 * Generate a random Solana address
 */
function generateAddress(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
	let address = '';
	for (let i = 0; i < 44; i++) {
		address += chars[Math.floor(Math.random() * chars.length)];
	}
	return address;
}

/**
 * Determine token status based on age and activity
 */
function determineStatus(age: number, volume5m: number, holders: number): TokenStatus {
	if (age < 300 && volume5m > 5000) return 'HOT'; // < 5 min, high volume
	if (age < 600 && volume5m > 2000) return 'WARM'; // < 10 min, decent volume
	if (volume5m < 100 || holders < 5) return 'DEAD'; // Low activity
	return 'COOL'; // Everything else
}

/**
 * Generate a single mock token
 */
export function generateMockToken(): Token {
	const name = generateTokenName();
	const ticker = generateTicker(name);
	const age = Math.floor(Math.random() * 3600); // 0-60 minutes
	const mcap = Math.random() * 100000 + 500; // $500 to $100,500
	const volume5m = Math.random() * 10000; // $0 to $10,000
	const holders = Math.floor(Math.random() * 200) + 1; // 1-200 holders
	const supply = Math.floor(Math.random() * 900000000) + 100000000; // 100M to 1B
	const price = mcap / supply;
	const liquidity = mcap * (Math.random() * 0.5 + 0.2); // 20-70% of mcap
	const bondcurveProgress = Math.random() * 100;
	const deployTime = Date.now() - age * 1000;

	const status = determineStatus(age, volume5m, holders);

	return {
		id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		name,
		ticker,
		address: generateAddress(),
		age,
		mcap,
		volume5m,
		holders,
		status,
		price,
		supply,
		liquidity,
		bondcurveProgress,
		deployer: generateAddress(),
		deployTime,
		createdAt: deployTime
	};
}

/**
 * Generate multiple mock tokens
 */
export function generateMockTokens(count: number = 25): Token[] {
	const tokens: Token[] = [];

	for (let i = 0; i < count; i++) {
		tokens.push(generateMockToken());
	}

	// Sort by age (newest first)
	return tokens.sort((a, b) => a.age - b.age);
}

/**
 * Get initial token feed
 */
export function getInitialTokenFeed(): Token[] {
	return generateMockTokens(25);
}

/**
 * Simulate token price changes
 */
export function updateTokenPrices(tokens: Token[]): Token[] {
	return tokens.map((token) => {
		// Random price change (-10% to +10%)
		const priceChange = (Math.random() - 0.5) * 0.2;
		const newPrice = token.price * (1 + priceChange);

		// Update mcap accordingly
		const newMcap = newPrice * token.supply;

		// Occasionally change volume
		const volumeChange = (Math.random() - 0.5) * 0.4;
		const newVolume = Math.max(0, token.volume5m * (1 + volumeChange));

		// Age increases
		const newAge = token.age + 10; // 10 seconds passed

		// Recalculate status
		const newStatus = determineStatus(newAge, newVolume, token.holders);

		return {
			...token,
			price: newPrice,
			mcap: newMcap,
			volume5m: newVolume,
			age: newAge,
			status: newStatus
		};
	});
}
