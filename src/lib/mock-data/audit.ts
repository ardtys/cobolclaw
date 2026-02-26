import type { Token } from '$lib/types/token';
import type { AuditReport, HolderAnalysis, TopHolder } from '$lib/types/audit';
import { calculateRiskScore } from '$lib/utils/risk-calculator';
import { getDeployerHistory } from './deployers';

/**
 * Generate mock holder analysis
 */
function generateMockHolderAnalysis(token: Token): HolderAnalysis {
	// Generate random holder percentages that add up reasonably
	const top10Percentage = 40 + Math.random() * 50; // 40-90%
	const devWalletPercentage = 5 + Math.random() * 20; // 5-25%
	const sniperCount = Math.floor(Math.random() * 8); // 0-7 snipers

	// Generate top holders
	const topHolders: TopHolder[] = [];
	let remainingPercentage = top10Percentage;

	for (let i = 0; i < 10; i++) {
		const isDeployer = i === 0;
		let percentage: number;

		if (isDeployer) {
			percentage = devWalletPercentage;
		} else if (i === 9) {
			percentage = remainingPercentage;
		} else {
			percentage = remainingPercentage * (0.1 + Math.random() * 0.15);
			remainingPercentage -= percentage;
		}

		const holderPercentage = Math.max(0.1, percentage);
		const holderAmount = (holderPercentage / 100) * token.supply;

		topHolders.push({
			address: generateRandomAddress(),
			amount: holderAmount,
			percentage: holderPercentage,
			isDeployer
		});
	}

	return {
		totalHolders: token.holders,
		top10Percentage,
		devWalletPercentage,
		sniperCount,
		topHolders
	};
}

/**
 * Generate random Solana address
 */
function generateRandomAddress(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
	let address = '';
	for (let i = 0; i < 44; i++) {
		address += chars[Math.floor(Math.random() * chars.length)];
	}
	return address;
}

/**
 * Generate mock audit report for a token
 */
export function generateMockAudit(token: Token): AuditReport {
	const holderAnalysis = generateMockHolderAnalysis(token);
	const deployerHistory = getDeployerHistory(token.deployer);

	// Random authority flags
	const hasMintAuthority = Math.random() < 0.15; // 15% chance
	const hasFreezeAuthority = Math.random() < 0.1; // 10% chance

	// Calculate risk score
	const { score, factors } = calculateRiskScore(
		token,
		{
			top10Percentage: holderAnalysis.top10Percentage,
			devWalletPercentage: holderAnalysis.devWalletPercentage,
			sniperCount: holderAnalysis.sniperCount
		},
		hasMintAuthority,
		hasFreezeAuthority,
		deployerHistory.rugRate
	);

	return {
		token,
		holderAnalysis,
		riskFactors: factors,
		riskScore: score,
		deployerHistory,
		generatedAt: Date.now()
	};
}

/**
 * Cache for audit reports
 */
const auditCache = new Map<string, AuditReport>();

/**
 * Get or generate audit report for a token
 */
export function getAuditReport(token: Token): AuditReport {
	const cacheKey = token.address;

	if (!auditCache.has(cacheKey)) {
		auditCache.set(cacheKey, generateMockAudit(token));
	}

	return auditCache.get(cacheKey)!;
}
