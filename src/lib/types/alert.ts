export interface Alert {
	id: string;
	type: AlertType;
	target: string; // token address or wallet address
	condition: string; // Human-readable condition
	threshold?: number;
	status: AlertStatus;
	createdAt: number;
	triggeredAt?: number;
}

export type AlertType = 'PRICE' | 'VOLUME' | 'WHALE';
export type AlertStatus = 'WATCHING' | 'TRIGGERED';

export function generateAlertId(): string {
	return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatAlertType(type: AlertType): string {
	return type;
}

export function formatAlertStatus(status: AlertStatus): string {
	return status;
}
