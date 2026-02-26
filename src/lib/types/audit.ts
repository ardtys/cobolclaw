import type { Token } from './token';
import type { TokenAuthorities } from '$lib/services/authorityCheck';
import type { HolderAnalysis as HolderAnalysisService } from '$lib/services/holderAnalysis';

export interface AuditReport {
	token: Token;
	holderAnalysis: HolderAnalysisService;
	riskFactors: RiskFactor[];
	riskScore: number; // 1-10
	deployerHistory: DeployerHistory;
	authorities?: TokenAuthorities;
	generatedAt: number;
	isRealData?: boolean;
}

// Re-export for compatibility
export type HolderAnalysis = HolderAnalysisService;

export interface TopHolder {
	address: string;
	amount: number;
	percentage: number;
	isDeployer: boolean;
}

export interface RiskFactor {
	type: 'warning' | 'success' | 'critical';
	message: string;
	impact: number; // Contribution to risk score (0-2)
}

export interface DeployerHistory {
	tokensDeployed: number;
	ruggedCount: number;
	avgTokenLife: number; // minutes
	verdict: string;
	rugRate: number; // percentage
}

export function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
	if (score <= 3) return 'LOW';
	if (score <= 6) return 'MEDIUM';
	return 'HIGH';
}

export function getRiskClass(score: number): string {
	if (score <= 3) return 'risk-low';
	if (score <= 6) return 'risk-medium';
	return 'risk-high';
}

export function getRiskDisplay(score: number): string {
	const bars = Math.round((score / 10) * 15);
	const filled = '█'.repeat(bars);
	const empty = '░'.repeat(15 - bars);
	return filled + empty;
}
