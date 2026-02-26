import { connection } from './helius';
import { PublicKey } from '@solana/web3.js';
import { MintLayout } from '@solana/spl-token';

export interface TokenAuthorities {
	hasMintAuthority: boolean;
	hasFreezeAuthority: boolean;
	mintAuthority: string | null;
	freezeAuthority: string | null;
	supply: number;
	decimals: number;
}

/**
 * Check token mint and freeze authorities
 */
export async function checkTokenAuthorities(mintAddress: string): Promise<TokenAuthorities> {
	try {
		const mintPubkey = new PublicKey(mintAddress);
		const mintInfo = await connection.getAccountInfo(mintPubkey);

		if (!mintInfo || !mintInfo.data) {
			throw new Error('Mint account not found');
		}

		// Parse mint data
		const mintData = MintLayout.decode(mintInfo.data);

		return {
			hasMintAuthority: mintData.mintAuthorityOption === 1,
			hasFreezeAuthority: mintData.freezeAuthorityOption === 1,
			mintAuthority: mintData.mintAuthorityOption === 1 ? mintData.mintAuthority.toString() : null,
			freezeAuthority:
				mintData.freezeAuthorityOption === 1 ? mintData.freezeAuthority.toString() : null,
			supply: Number(mintData.supply),
			decimals: mintData.decimals
		};
	} catch (error) {
		console.error('Error checking token authorities:', error);
		throw error;
	}
}

/**
 * Calculate authority risk score
 * Higher score = higher risk
 */
export function calculateAuthorityRisk(authorities: TokenAuthorities): number {
	let risk = 0;

	// Mint authority present = +40 risk
	if (authorities.hasMintAuthority) {
		risk += 40;
	}

	// Freeze authority present = +30 risk
	if (authorities.hasFreezeAuthority) {
		risk += 30;
	}

	return risk;
}

/**
 * Get authority warning message
 */
export function getAuthorityWarning(authorities: TokenAuthorities): string {
	if (authorities.hasMintAuthority && authorities.hasFreezeAuthority) {
		return '🚨 CRITICAL: Both mint and freeze authorities enabled!';
	}

	if (authorities.hasMintAuthority) {
		return '⚠️ WARNING: Mint authority can create unlimited tokens!';
	}

	if (authorities.hasFreezeAuthority) {
		return '⚠️ WARNING: Freeze authority can lock your tokens!';
	}

	return '✓ SAFE: No dangerous authorities detected';
}
