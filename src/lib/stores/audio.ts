import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { settings } from './settings';

interface AudioState {
	initialized: boolean;
	enabled: boolean;
	sounds: {
		keystroke: AudioBuffer | null;
		printer: AudioBuffer | null;
		ambientHum: AudioBuffer | null;
	};
	audioContext: AudioContext | null;
	ambientSource: AudioBufferSourceNode | null;
	ambientGain: GainNode | null;
}

const initialState: AudioState = {
	initialized: false,
	enabled: false,
	sounds: {
		keystroke: null,
		printer: null,
		ambientHum: null
	},
	audioContext: null,
	ambientSource: null,
	ambientGain: null
};

function createAudioStore() {
	const { subscribe, set, update } = writable<AudioState>(initialState);

	let audioContext: AudioContext | null = null;

	async function initialize() {
		if (!browser || audioContext) return;

		try {
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

			update((state) => ({
				...state,
				initialized: true,
				audioContext,
				enabled: get(settings).soundEffects
			}));

			// Note: Sound files would need to be loaded here
			// For now, we'll just mark as initialized
			// In a real implementation, you would load the sound files:
			// await loadSound('keystroke', '/sounds/keystroke.mp3');
			// await loadSound('printer', '/sounds/printer.mp3');
			// await loadSound('ambientHum', '/sounds/ambient-hum.mp3');

			return true;
		} catch (error) {
			console.error('Failed to initialize audio:', error);
			return false;
		}
	}

	async function loadSound(name: keyof AudioState['sounds'], url: string) {
		if (!audioContext) return;

		try {
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

			update((state) => ({
				...state,
				sounds: {
					...state.sounds,
					[name]: audioBuffer
				}
			}));
		} catch (error) {
			console.error(`Failed to load sound ${name}:`, error);
		}
	}

	function playSound(name: keyof AudioState['sounds'], volumeMultiplier: number = 1.0) {
		const state = get({ subscribe });

		if (!state.initialized || !state.enabled || !state.audioContext) return;

		const sound = state.sounds[name];
		if (!sound) return;

		try {
			const source = state.audioContext.createBufferSource();
			source.buffer = sound;

			const gainNode = state.audioContext.createGain();
			const volume = get(settings).volume * volumeMultiplier;
			gainNode.gain.value = volume;

			source.connect(gainNode);
			gainNode.connect(state.audioContext.destination);

			source.start(0);
		} catch (error) {
			console.error(`Failed to play sound ${name}:`, error);
		}
	}

	function playKeystroke() {
		playSound('keystroke', 0.3);
	}

	function playPrinter() {
		playSound('printer', 0.5);
	}

	function startAmbientHum() {
		const state = get({ subscribe });

		if (!state.initialized || !state.enabled || !state.audioContext || state.ambientSource)
			return;

		const sound = state.sounds.ambientHum;
		if (!sound) return;

		try {
			const source = state.audioContext.createBufferSource();
			source.buffer = sound;
			source.loop = true;

			const gainNode = state.audioContext.createGain();
			const volume = get(settings).volume * 0.2; // Very quiet for ambient
			gainNode.gain.value = volume;

			source.connect(gainNode);
			gainNode.connect(state.audioContext.destination);

			source.start(0);

			update((s) => ({
				...s,
				ambientSource: source,
				ambientGain: gainNode
			}));
		} catch (error) {
			console.error('Failed to start ambient hum:', error);
		}
	}

	function stopAmbientHum() {
		update((state) => {
			if (state.ambientSource) {
				try {
					state.ambientSource.stop();
				} catch (error) {
					console.error('Failed to stop ambient hum:', error);
				}
			}
			return {
				...state,
				ambientSource: null,
				ambientGain: null
			};
		});
	}

	function toggleEnabled() {
		update((state) => {
			const newEnabled = !state.enabled;

			// Stop ambient if disabling
			if (!newEnabled && state.ambientSource) {
				try {
					state.ambientSource.stop();
				} catch (error) {
					console.error('Failed to stop ambient:', error);
				}
			}

			return {
				...state,
				enabled: newEnabled,
				ambientSource: newEnabled ? state.ambientSource : null
			};
		});
	}

	function setVolume(volume: number) {
		update((state) => {
			// Update ambient gain if playing
			if (state.ambientGain) {
				state.ambientGain.gain.value = volume * 0.2;
			}
			return state;
		});
	}

	return {
		subscribe,
		initialize,
		loadSound,
		playKeystroke,
		playPrinter,
		startAmbientHum,
		stopAmbientHum,
		toggleEnabled,
		setVolume
	};
}

export const audio = createAudioStore();
