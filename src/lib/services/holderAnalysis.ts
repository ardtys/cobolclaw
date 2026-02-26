import { connection, getTokenSupply } from './helius';
import { PublicKey } from '@solana/web3.js';

export interface HolderInfo {
	address: string;
	amount: number;
	percentage: number;
	isDeployer: boolean;
}

export interface HolderAnalysis {
	totalHolders: number;
	top10Percentage: number;
	devWalletPercentage: number;
	sniperCount: number;
	topHolders: HolderInfo[];
}

/**
 * Analyze token holders
 */
export async function analyzeHolders(
	mintAddress: string,
	deployerAddress?: string
): Promise<HolderAnalysis> {
	try {
		// Get token supply first
		const supply = await getTokenSupply(mintAddress);

		// Get largest token accounts
		const largestAccounts = await connection.getTokenLargestAccounts(
			new PublicKey(mintAddress)
		);

		if (!largestAccounts.value || largestAccounts.value.length === 0) {
			return getDefaultAnalysis();
		}

		// Convert to holder info with percentages
		const topHolders: HolderInfo[] = largestAccounts.value.map((account) => {
			const amount = Number(account.amount) / Math.pow(10, account.decimals || 9);
			const percentage = (amount / supply) * 100;

			return {
				address: account.address.toString(),
				amount,
				percentage,
				isDeployer: deployerAddress
					? account.address.toString() === deployerAddress
					: false
			};
		});

		// Sort by percentage descending
		topHolders.sort((a, b) => b.percentage - a.percentage);

		// Calculate metrics
		const top10 = topHolders.slice(0, 10);
		const top10Percentage = top10.reduce((sum, holder) => sum + holder.percentage, 0);

		// Dev wallet is usually the deployer or first holder
		const devWalletPercentage = deployerAddress
			? topHolders.find((h) => h.address === deployerAddress)?.percentage || 0
			: topHolders[0]?.percentage || 0;

		// Count snipers (holders with > 1% but not top 3)
		const sniperCount = topHolders.filter(
			(holder, index) => index > 2 && holder.percentage > 1
		).length;

		return {
			totalHolders: largestAccounts.value.length,
			top10Percentage,
			devWalletPercentage,
			sniperCount,
			topHolders: topHolders.slice(0, 10)
		};
	} catch (error) {
		console.error('Error analyzing holders:', error);
		return getDefaultAnalysis();
	}
}

/**
 * Get default analysis when data unavailable
 */
function getDefaultAnalysis(): HolderAnalysis {
	return {
		totalHolders: 0,
		top10Percentage: 0,
		devWalletPercentage: 0,
		sniperCount: 0,
		topHolders: []
	};
}

/**
 * Check if holder distribution is suspicious
 */
export function isHolderDistributionSuspicious(analysis: HolderAnalysis): boolean {
	// Red flags:
	// 1. Top 10 holders own > 80% of supply
	if (analysis.top10Percentage > 80) return true;

	// 2. Dev wallet owns > 20% of supply
	if (analysis.devWalletPercentage > 20) return true;

	// 3. Very few holders (< 10)
	if (analysis.totalHolders < 10) return true;

	// 4. High concentration of snipers
	if (analysis.sniperCount > 5) return true;

	return false;
}

/**
 * Get holder concentration risk level
 */
export function getHolderConcentrationRisk(top10Percentage: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
	if (top10Percentage > 90) return 'CRITICAL';
	if (top10Percentage > 75) return 'HIGH';
	if (top10Percentage > 60) return 'MEDIUM';
	return 'LOW';
}

/**
 * Format holder address for display
 */
export function formatHolderAddress(address: string, startChars = 4, endChars = 4): string {
	if (address.length <= startChars + endChars) {
		return address;
	}
	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
