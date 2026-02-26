import type { CommandHandler, CommandOutput } from '$lib/types/command';
import type { RiskFactor } from '$lib/types/audit';
import { generateOutputId } from '../parser';
import { tokens } from '$lib/stores/tokens';
import { getAuditReport } from '$lib/mock-data/audit';
import { analyzeHolders } from '$lib/services/holderAnalysis';
import { checkTokenAuthorities, calculateAuthorityRisk } from '$lib/services/authorityCheck';
import { deployerDB } from '$lib/services/deployerDB';
import { rpcErrorHandler } from '$lib/services/rpcErrorHandler';
import { get } from 'svelte/store';

const USE_REAL_DATA = true;

export const auditHandler: CommandHandler = async (args, rawInput): Promise<CommandOutput> => {
	// Require token identifier
	if (args.length === 0) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-1002
DESCRIPTION: TOKEN IDENTIFIER REQUIRED
USAGE: AUDIT [TICKER] or AUDIT [ADDRESS]
EXAMPLE: AUDIT $BEER or AUDIT 7xKp9f...3fRmZq
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	const tokenIdentifier = args[0].toUpperCase();

	// Find token in feed
	const tokenFeed = get(tokens).feed;
	let targetToken = tokenFeed.find(
		(t) =>
			t.ticker.toUpperCase() === tokenIdentifier ||
			t.address.toUpperCase() === tokenIdentifier.toUpperCase()
	);

	// If not found in feed, check if it's an address and create error
	if (!targetToken) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-3001
DESCRIPTION: TOKEN NOT FOUND
INPUT: ${tokenIdentifier}
SUGGESTION: CHECK TICKER OR PASTE FULL CONTRACT ADDRESS
           TYPE "SCAN" TO VIEW AVAILABLE TOKENS
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	// Generate audit report with real data or fallback to mock
	let audit;

	if (USE_REAL_DATA) {
		audit = await rpcErrorHandler.withFallback(
			async () => {
				// Fetch real on-chain data
				const [holderAnalysis, authorities, deployerHistory] = await Promise.all([
					analyzeHolders(targetToken.address, targetToken.deployer),
					checkTokenAuthorities(targetToken.address),
					deployerDB.getDeployerHistory(targetToken.deployer)
				]);

				// Calculate real risk score (0-100 scale)
				const authorityRisk = calculateAuthorityRisk(authorities);
				const holderRisk = calculateHolderRisk(holderAnalysis);
				const deployerRisk = calculateDeployerRisk(deployerHistory);
				const ageRisk = calculateAgeRisk(targetToken.age);

				const totalRiskRaw = Math.min(
					100,
					authorityRisk + holderRisk + deployerRisk + ageRisk
				);

				// Convert to 1-10 scale for display
				const riskScore = Math.max(1, Math.min(10, Math.round(totalRiskRaw / 10)));

				// Build real audit report
				return {
					token: targetToken,
					holderAnalysis,
					authorities,
					deployerHistory,
					riskScore,
					riskFactors: generateRiskFactors(
						holderAnalysis,
						authorities,
						deployerHistory,
						targetToken
					),
					generatedAt: Date.now(),
					isRealData: true
				};
			},
			() => getAuditReport(targetToken),
			'Failed to fetch real audit data, using mock'
		);
	} else {
		audit = getAuditReport(targetToken);
	}

	// Cache the audit
	tokens.cacheAudit(targetToken.address, audit);

	// Return audit component output
	return {
		id: generateOutputId(),
		command: rawInput,
		output: {
			type: 'audit',
			data: { audit }
		},
		timestamp: Date.now(),
		type: 'component'
	};
};

/**
 * Calculate risk from holder distribution
 */
function calculateHolderRisk(holderAnalysis: any): number {
	let risk = 0;

	// Top 10 concentration > 80% = high risk
	if (holderAnalysis.top10Percentage > 80) {
		risk += 30;
	} else if (holderAnalysis.top10Percentage > 60) {
		risk += 20;
	} else if (holderAnalysis.top10Percentage > 40) {
		risk += 10;
	}

	// Dev wallet > 30% = high risk
	if (holderAnalysis.devWalletPercentage > 30) {
		risk += 20;
	} else if (holderAnalysis.devWalletPercentage > 20) {
		risk += 10;
	}

	// Few holders = higher risk
	if (holderAnalysis.totalHolders < 10) {
		risk += 20;
	} else if (holderAnalysis.totalHolders < 50) {
		risk += 10;
	}

	return risk;
}

/**
 * Calculate risk from deployer history
 */
function calculateDeployerRisk(deployerHistory: any): number {
	let risk = 0;

	if (deployerHistory.tokensDeployed === 0) return 0;

	const rugRate = deployerHistory.ruggedCount / deployerHistory.tokensDeployed;

	if (rugRate > 0.7) {
		risk = 40; // Serial rugger
	} else if (rugRate > 0.4) {
		risk = 30; // High risk deployer
	} else if (rugRate > 0.2) {
		risk = 15; // Caution advised
	}

	return risk;
}

/**
 * Calculate risk from token age
 */
function calculateAgeRisk(age: number): number {
	// Very young tokens = higher risk
	if (age < 300) return 10; // < 5 minutes
	if (age < 1800) return 5; // < 30 minutes
	return 0;
}

/**
 * Generate risk factors array
 */
function generateRiskFactors(
	holderAnalysis: any,
	authorities: any,
	deployerHistory: any,
	token: any
): RiskFactor[] {
	const factors: RiskFactor[] = [];

	// Authority risks
	if (authorities.hasMintAuthority) {
		factors.push({
			type: 'critical',
			message: 'MINT AUTHORITY ENABLED - Can create unlimited tokens',
			impact: 2
		});
	}
	if (authorities.hasFreezeAuthority) {
		factors.push({
			type: 'warning',
			message: 'FREEZE AUTHORITY ENABLED - Can lock your tokens',
			impact: 1.5
		});
	}

	// Holder concentration risks
	if (holderAnalysis.top10Percentage > 80) {
		factors.push({
			type: 'critical',
			message: `EXTREME CONCENTRATION - Top 10 hold ${holderAnalysis.top10Percentage.toFixed(1)}%`,
			impact: 2
		});
	} else if (holderAnalysis.top10Percentage > 60) {
		factors.push({
			type: 'warning',
			message: `HIGH CONCENTRATION - Top 10 hold ${holderAnalysis.top10Percentage.toFixed(1)}%`,
			impact: 1
		});
	}

	if (holderAnalysis.devWalletPercentage > 30) {
		factors.push({
			type: 'critical',
			message: `DEV HOLDS ${holderAnalysis.devWalletPercentage.toFixed(1)}% - High dump risk`,
			impact: 2
		});
	}

	// Deployer risks
	const rugRate = deployerHistory.tokensDeployed > 0
		? deployerHistory.ruggedCount / deployerHistory.tokensDeployed
		: 0;

	if (rugRate > 0.7) {
		factors.push({
			type: 'critical',
			message: `SERIAL RUGGER - Deployer rugged ${deployerHistory.ruggedCount}/${deployerHistory.tokensDeployed} tokens`,
			impact: 2
		});
	} else if (rugRate > 0.4) {
		factors.push({
			type: 'warning',
			message: `RISKY DEPLOYER - ${Math.round(rugRate * 100)}% rug rate`,
			impact: 1.5
		});
	}

	// Low holders
	if (holderAnalysis.totalHolders < 10) {
		factors.push({
			type: 'warning',
			message: `VERY FEW HOLDERS - Only ${holderAnalysis.totalHolders} wallets`,
			impact: 1
		});
	}

	// Age risk
	if (token.age < 300) {
		factors.push({
			type: 'warning',
			message: 'EXTREMELY NEW - Less than 5 minutes old',
			impact: 1
		});
	}

	// If no risks found
	if (factors.length === 0) {
		factors.push({
			type: 'success',
			message: 'No major red flags detected',
			impact: 0
		});
	}

	return factors;
}
