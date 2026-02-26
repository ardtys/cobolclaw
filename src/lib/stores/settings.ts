import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Settings {
	rpcEndpoint: 'HELIUS' | 'QUICKNODE' | 'CUSTOM';
	customRpcUrl?: string;
	scanRefreshRate: 5 | 10 | 30 | 60; // seconds
	slippage: 0.5 | 1.0 | 2.0 | 5.0 | number; // percentage
	priorityFee: 'AUTO' | 'LOW' | 'MED' | 'HIGH' | number;
	soundEffects: boolean;
	crtEffects: boolean;
	theme: 'green' | 'amber' | 'cyan' | 'red';
	volume: number; // 0-1
}

const defaultSettings: Settings = {
	rpcEndpoint: 'HELIUS',
	scanRefreshRate: 10,
	slippage: 1.0,
	priorityFee: 'AUTO',
	soundEffects: true,
	crtEffects: true,
	theme: 'green',
	volume: 0.5
};

// Load settings from localStorage if available
function loadSettings(): Settings {
	if (!browser) return defaultSettings;

	try {
		const stored = localStorage.getItem('cobolclaw_settings');
		if (stored) {
			const parsed = JSON.parse(stored);
			return { ...defaultSettings, ...parsed };
		}
	} catch (error) {
		console.error('Failed to load settings from localStorage:', error);
	}

	return defaultSettings;
}

// Create the store
function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>(loadSettings());

	return {
		subscribe,
		set: (value: Settings) => {
			set(value);
			if (browser) {
				localStorage.setItem('cobolclaw_settings', JSON.stringify(value));
			}
		},
		update: (fn: (value: Settings) => Settings) => {
			update((current) => {
				const updated = fn(current);
				if (browser) {
					localStorage.setItem('cobolclaw_settings', JSON.stringify(updated));
				}
				return updated;
			});
		},
		updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
			update((current) => {
				const updated = { ...current, [key]: value };
				if (browser) {
					localStorage.setItem('cobolclaw_settings', JSON.stringify(updated));
				}
				return updated;
			});
		},
		reset: () => {
			set(defaultSettings);
			if (browser) {
				localStorage.setItem('cobolclaw_settings', JSON.stringify(defaultSettings));
			}
		}
	};
}

export const settings = createSettingsStore();
