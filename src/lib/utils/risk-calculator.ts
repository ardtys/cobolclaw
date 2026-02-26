import type { Token } from '$lib/types/token';
import type { AuditReport, RiskFactor } from '$lib/types/audit';

/**
 * Calculate risk score for a token (1-10 scale)
 * Higher score = higher risk
 */
export function calculateRiskScore(
	token: Token,
	holderAnalysis: {
		top10Percentage: number;
		devWalletPercentage: number;
		sniperCount: number;
	},
	hasMintAuthority: boolean,
	hasFreezeAuthority: boolean,
	deployerRugRate: number
): { score: number; factors: RiskFactor[] } {
	let score = 0;
	const factors: RiskFactor[] = [];

	// Factor 1: Top 10 holder concentration (0-2 points)
	if (holderAnalysis.top10Percentage > 80) {
		score += 2;
		factors.push({
			type: 'critical',
			message: 'TOP 10 WALLETS HOLD >80% OF SUPPLY',
			impact: 2
		});
	} else if (holderAnalysis.top10Percentage > 60) {
		score += 1.5;
		factors.push({
			type: 'warning',
			message: 'TOP 10 WALLETS HOLD >60% OF SUPPLY',
			impact: 1.5
		});
	} else if (holderAnalysis.top10Percentage < 40) {
		factors.push({
			type: 'success',
			message: 'WELL-DISTRIBUTED HOLDER BASE',
			impact: 0
		});
	}

	// Factor 2: Dev wallet percentage (0-2 points)
	if (holderAnalysis.devWalletPercentage > 20) {
		score += 2;
		factors.push({
			type: 'critical',
			message: `DEV HOLDS ${holderAnalysis.devWalletPercentage.toFixed(1)}% OF SUPPLY`,
			impact: 2
		});
	} else if (holderAnalysis.devWalletPercentage > 10) {
		score += 1;
		factors.push({
			type: 'warning',
			message: `DEV HOLDS ${holderAnalysis.devWalletPercentage.toFixed(1)}% OF SUPPLY`,
			impact: 1
		});
	} else {
		factors.push({
			type: 'success',
			message: 'DEV WALLET HOLDS <10% OF SUPPLY',
			impact: 0
		});
	}

	// Factor 3: Token age (0-1.5 points)
	if (token.age < 300) {
		// < 5 minutes
		score += 1.5;
		factors.push({
			type: 'warning',
			message: 'TOKEN AGE < 5 MINUTES — VERY FRESH',
			impact: 1.5
		});
	} else if (token.age < 1800) {
		// < 30 minutes
		score += 0.5;
		factors.push({
			type: 'warning',
			message: 'TOKEN AGE < 30 MINUTES',
			impact: 0.5
		});
	}

	// Factor 4: Mint authority (0-2 points)
	if (hasMintAuthority) {
		score += 2;
		factors.push({
			type: 'critical',
			message: 'MINT AUTHORITY PRESENT — CAN INFLATE SUPPLY',
			impact: 2
		});
	} else {
		factors.push({
			type: 'success',
			message: 'NO MINT AUTHORITY',
			impact: 0
		});
	}

	// Factor 5: Freeze authority (0-1.5 points)
	if (hasFreezeAuthority) {
		score += 1.5;
		factors.push({
			type: 'critical',
			message: 'FREEZE AUTHORITY PRESENT — CAN FREEZE WALLETS',
			impact: 1.5
		});
	} else {
		factors.push({
			type: 'success',
			message: 'NO FREEZE AUTHORITY',
			impact: 0
		});
	}

	// Factor 6: Deployer rug history (0-2 points)
	if (deployerRugRate > 80) {
		score += 2;
		factors.push({
			type: 'critical',
			message: `DEPLOYER HAS ${deployerRugRate.toFixed(0)}% RUG RATE`,
			impact: 2
		});
	} else if (deployerRugRate > 50) {
		score += 1.5;
		factors.push({
			type: 'warning',
			message: `DEPLOYER HAS ${deployerRugRate.toFixed(0)}% RUG RATE`,
			impact: 1.5
		});
	} else if (deployerRugRate < 20) {
		factors.push({
			type: 'success',
			message: 'DEPLOYER HAS GOOD TRACK RECORD',
			impact: 0
		});
	}

	// Factor 7: Liquidity ratio (0-1 point)
	const liquidityRatio = token.liquidity / token.mcap;
	if (liquidityRatio < 0.1) {
		score += 1;
		factors.push({
			type: 'warning',
			message: 'LOW LIQUIDITY RATIO — EXIT MAY BE DIFFICULT',
			impact: 1
		});
	}

	// Factor 8: Sniper wallets (0-0.5 points)
	if (holderAnalysis.sniperCount > 5) {
		score += 0.5;
		factors.push({
			type: 'warning',
			message: `${holderAnalysis.sniperCount} SNIPER WALLETS DETECTED`,
			impact: 0.5
		});
	}

	// Ensure score is within 1-10 range
	score = Math.min(10, Math.max(1, Math.round(score * 10) / 10));

	return { score, factors };
}

/**
 * Generate verdict text based on risk score
 */
export function getRiskVerdict(score: number): string {
	if (score <= 2) return 'LOW RISK — RELATIVELY SAFE';
	if (score <= 4) return 'MODERATE RISK — PROCEED WITH CAUTION';
	if (score <= 6) return 'ELEVATED RISK — SIGNIFICANT CONCERNS';
	if (score <= 8) return 'HIGH RISK — NOT RECOMMENDED';
	return 'CRITICAL RISK — LIKELY RUG/SCAM';
}
