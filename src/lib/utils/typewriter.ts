/**
 * Typewriter effect utility
 * Simulates character-by-character typing animation
 */

export interface TypewriterOptions {
	speed: number; // milliseconds per character
	onChar?: (char: string) => void;
	onComplete?: () => void;
}

export async function typewriterEffect(
	text: string,
	callback: (displayed: string) => void,
	options: TypewriterOptions = { speed: 30 }
): Promise<void> {
	let displayed = '';

	for (let i = 0; i < text.length; i++) {
		displayed += text[i];
		callback(displayed);

		if (options.onChar) {
			options.onChar(text[i]);
		}

		await new Promise((resolve) => setTimeout(resolve, options.speed));
	}

	if (options.onComplete) {
		options.onComplete();
	}
}

export async function typewriterLines(
	lines: Array<{ delay: number; text: string }>,
	callback: (lineIndex: number, text: string) => void,
	charSpeed: number = 30
): Promise<void> {
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Wait for the delay before this line
		if (line.delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, line.delay));
		}

		// Type out this line
		let displayed = '';
		for (let j = 0; j < line.text.length; j++) {
			displayed += line.text[j];
			callback(i, displayed);
			await new Promise((resolve) => setTimeout(resolve, charSpeed));
		}
	}
}
