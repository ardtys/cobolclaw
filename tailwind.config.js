/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'crt-green': '#33FF33',
				'crt-green-dim': '#1A8C1A',
				'crt-green-glow': '#33FF3366',
				'crt-amber': '#FFB000',
				'crt-red': '#FF3333',
				'crt-cyan': '#00FFFF',
				'bg-black': '#0A0A0A',
				'bg-dark': '#111111'
			},
			fontFamily: {
				mono: ['"IBM Plex Mono"', '"Share Tech Mono"', '"Courier New"', 'monospace'],
				display: ['"Share Tech Mono"', '"IBM Plex Mono"', 'monospace']
			},
			fontSize: {
				terminal: '12px',
				'terminal-cmd': '14px',
				'terminal-header': '24px'
			},
			animation: {
				'cursor-blink': 'blink 530ms step-end infinite',
				'screen-flicker': 'flicker 8s infinite',
				'flash-green': 'flash 500ms ease-out'
			},
			keyframes: {
				blink: {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				},
				flicker: {
					'0%, 100%': { opacity: '0.97' },
					'10%, 30%, 50%, 70%, 90%': { opacity: '1' },
					'20%, 40%, 60%, 80%': { opacity: '0.98' }
				},
				flash: {
					'0%': { filter: 'brightness(1.5)', textShadow: '0 0 12px var(--crt-green-glow)' },
					'100%': { filter: 'brightness(1)', textShadow: '0 0 8px var(--crt-green-glow)' }
				}
			},
			screens: {
				'xs': '320px'
			}
		}
	},
	plugins: []
};
