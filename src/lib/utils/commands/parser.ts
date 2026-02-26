import type { Command } from '$lib/types/command';

/**
 * Parse a command string into a Command object
 * @param input Raw command input string
 * @returns Parsed Command object
 */
export function parseCommand(input: string): Command {
	// Trim and convert to uppercase
	const trimmed = input.trim().toUpperCase();

	// Split by spaces, but respect quoted strings
	const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

	// First part is the command name
	const name = parts[0] || '';

	// Rest are arguments, remove quotes from quoted args
	const args = parts.slice(1).map((arg) => arg.replace(/"/g, ''));

	return {
		name,
		args,
		rawInput: input.trim()
	};
}

/**
 * Validate a command argument as a number
 */
export function validateNumber(arg: string): { valid: boolean; value?: number; error?: string } {
	const num = parseFloat(arg);
	if (isNaN(num)) {
		return { valid: false, error: `INVALID NUMBER: ${arg}` };
	}
	return { valid: true, value: num };
}

/**
 * Validate a command argument as a token ticker or address
 */
export function validateToken(arg: string): { valid: boolean; value: string; error?: string } {
	if (!arg || arg.length === 0) {
		return { valid: false, value: arg, error: 'TOKEN IDENTIFIER REQUIRED' };
	}

	// Accept both tickers (starting with $) and addresses
	if (arg.startsWith('$') || arg.length > 20) {
		return { valid: true, value: arg };
	}

	return { valid: false, value: arg, error: 'INVALID TOKEN FORMAT (USE $TICKER OR ADDRESS)' };
}

/**
 * Validate a wallet address
 */
export function validateAddress(
	arg: string
): { valid: boolean; value: string; error?: string } {
	if (!arg || arg.length < 32) {
		return { valid: false, value: arg, error: 'INVALID WALLET ADDRESS' };
	}
	return { valid: true, value: arg };
}

/**
 * Parse a comparison operator from a string (e.g., ">", "<", ">=", "<=", "=")
 */
export function parseOperator(
	str: string
): { operator: string; value: number } | { error: string } {
	const match = str.match(/^([><=]+)([0-9.]+)$/);
	if (!match) {
		return { error: 'INVALID OPERATOR FORMAT (USE >, <, >=, <=, = WITH NUMBER)' };
	}

	const operator = match[1];
	const value = parseFloat(match[2]);

	if (isNaN(value)) {
		return { error: 'INVALID NUMBER IN CONDITION' };
	}

	return { operator, value };
}

/**
 * Generate a unique output ID
 */
export function generateOutputId(): string {
	return `output_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
