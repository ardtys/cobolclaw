import { connection } from './helius';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

export interface TokenMetadata {
	name: string;
	symbol: string;
	uri: string;
	image?: string;
	description?: string;
	updateAuthority: string;
}

/**
 * Fetch token metadata from on-chain or API
 */
export async function fetchTokenMetadata(mintAddress: string): Promise<TokenMetadata> {
	try {
		// First, try to get metadata from Helius DAS API
		const metadata = await fetchMetadataFromHelius(mintAddress);
		if (metadata) {
			return metadata;
		}

		// Fallback to on-chain metadata
		return await fetchMetadataOnChain(mintAddress);
	} catch (error) {
		console.error('Error fetching token metadata:', error);

		// Return default metadata on error
		return {
			name: 'Unknown Token',
			symbol: 'UNKNOWN',
			uri: '',
			updateAuthority: mintAddress
		};
	}
}

/**
 * Fetch metadata using Helius DAS API
 */
async function fetchMetadataFromHelius(mintAddress: string): Promise<TokenMetadata | null> {
	try {
		const response = await axios.post(
			'https://mainnet.helius-rpc.com/?api-key=6b354dae-a508-4167-96e5-36f7bd9a9d4b',
			{
				jsonrpc: '2.0',
				id: 'metadata-request',
				method: 'getAsset',
				params: {
					id: mintAddress
				}
			},
			{
				timeout: 5000
			}
		);

		const asset = response.data?.result;

		if (asset && asset.content) {
			return {
				name: asset.content.metadata?.name || 'Unknown',
				symbol: asset.content.metadata?.symbol || 'UNKNOWN',
				uri: asset.content.json_uri || '',
				image: asset.content.links?.image || asset.content.files?.[0]?.uri,
				description: asset.content.metadata?.description,
				updateAuthority: asset.authorities?.[0]?.address || mintAddress
			};
		}

		return null;
	} catch (error) {
		// Fail silently and try next method
		return null;
	}
}

/**
 * Fetch metadata from on-chain (Metaplex)
 */
async function fetchMetadataOnChain(mintAddress: string): Promise<TokenMetadata> {
	try {
		// Calculate Metaplex metadata PDA
		const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
			'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
		);

		const [metadataPDA] = PublicKey.findProgramAddressSync(
			[
				Buffer.from('metadata'),
				TOKEN_METADATA_PROGRAM_ID.toBuffer(),
				new PublicKey(mintAddress).toBuffer()
			],
			TOKEN_METADATA_PROGRAM_ID
		);

		const accountInfo = await connection.getAccountInfo(metadataPDA);

		if (!accountInfo) {
			throw new Error('Metadata account not found');
		}

		// Parse metadata (simplified - would need full Metaplex parser)
		const data = accountInfo.data;

		// Extract name and symbol from data (rough parsing)
		// This is simplified - real implementation would use Metaplex SDK
		const nameLength = data.readUInt32LE(69);
		const name = data.slice(73, 73 + nameLength).toString('utf-8').replace(/\0/g, '');

		const symbolStart = 73 + nameLength + 4;
		const symbolLength = data.readUInt32LE(symbolStart - 4);
		const symbol = data.slice(symbolStart, symbolStart + symbolLength).toString('utf-8').replace(/\0/g, '');

		const uriStart = symbolStart + symbolLength + 4;
		const uriLength = data.readUInt32LE(uriStart - 4);
		const uri = data.slice(uriStart, uriStart + uriLength).toString('utf-8').replace(/\0/g, '');

		// Get update authority (first 32 bytes)
		const updateAuthority = new PublicKey(data.slice(1, 33)).toString();

		return {
			name: name || 'Unknown',
			symbol: symbol || 'UNKNOWN',
			uri: uri || '',
			updateAuthority
		};
	} catch (error) {
		console.error('Error fetching on-chain metadata:', error);
		throw error;
	}
}

/**
 * Fetch token image from metadata URI
 */
export async function fetchTokenImage(uri: string): Promise<string | null> {
	try {
		if (!uri) return null;

		const response = await axios.get(uri, {
			timeout: 3000
		});

		return response.data?.image || null;
	} catch (error) {
		console.error('Error fetching token image:', error);
		return null;
	}
}

/**
 * Batch fetch metadata for multiple tokens
 */
export async function batchFetchMetadata(mintAddresses: string[]): Promise<Map<string, TokenMetadata>> {
	const metadataMap = new Map<string, TokenMetadata>();

	// Fetch in parallel with limit
	const batchSize = 10;
	for (let i = 0; i < mintAddresses.length; i += batchSize) {
		const batch = mintAddresses.slice(i, i + batchSize);
		const results = await Promise.allSettled(
			batch.map(async (mint) => {
				const metadata = await fetchTokenMetadata(mint);
				return { mint, metadata };
			})
		);

		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				metadataMap.set(result.value.mint, result.value.metadata);
			}
		});
	}

	return metadataMap;
}
