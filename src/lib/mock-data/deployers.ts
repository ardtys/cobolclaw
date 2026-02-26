import type { DeployerHistory } from '$lib/types/audit';

/**
 * Generate mock deployer history
 */
export function generateMockDeployerHistory(): DeployerHistory {
	// Random deployer type
	const deployerType = Math.random();

	if (deployerType < 0.2) {
		// Good deployer (20% chance)
		return {
			tokensDeployed: Math.floor(Math.random() * 10) + 5,
			ruggedCount: Math.floor(Math.random() * 2),
			avgTokenLife: Math.floor(Math.random() * 2000) + 500, // 500-2500 minutes
			verdict: 'LEGITIMATE DEVELOPER — GOOD TRACK RECORD',
			rugRate: Math.random() * 20 // 0-20%
		};
	} else if (deployerType < 0.5) {
		// Mixed deployer (30% chance)
		const deployed = Math.floor(Math.random() * 15) + 5;
		const rugged = Math.floor(deployed * (0.3 + Math.random() * 0.3)); // 30-60%
		return {
			tokensDeployed: deployed,
			ruggedCount: rugged,
			avgTokenLife: Math.floor(Math.random() * 500) + 100, // 100-600 minutes
			verdict: 'MIXED RECORD — SOME RUGS DETECTED',
			rugRate: (rugged / deployed) * 100
		};
	} else {
		// Serial rugger (50% chance - because this is memecoins lol)
		const deployed = Math.floor(Math.random() * 25) + 8;
		const rugged = Math.floor(deployed * (0.6 + Math.random() * 0.35)); // 60-95%
		return {
			tokensDeployed: deployed,
			ruggedCount: rugged,
			avgTokenLife: Math.floor(Math.random() * 100) + 20, // 20-120 minutes
			verdict: '▓▓ SERIAL DEPLOYER — CAUTION',
			rugRate: (rugged / deployed) * 100
		};
	}
}

/**
 * Get cached or generate deployer history for an address
 */
const deployerCache = new Map<string, DeployerHistory>();

export function getDeployerHistory(deployerAddress: string): DeployerHistory {
	if (!deployerCache.has(deployerAddress)) {
		deployerCache.set(deployerAddress, generateMockDeployerHistory());
	}
	return deployerCache.get(deployerAddress)!;
}
