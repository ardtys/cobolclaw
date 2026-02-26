import { writable, derived } from 'svelte/store';
import type { Alert, AlertType, AlertStatus } from '$lib/types/alert';
import { generateAlertId } from '$lib/types/alert';

interface AlertsState {
	alerts: Alert[];
	lastTriggered: Alert | null;
}

const initialState: AlertsState = {
	alerts: [],
	lastTriggered: null
};

function createAlertsStore() {
	const { subscribe, set, update } = writable<AlertsState>(initialState);

	return {
		subscribe,

		addAlert: (type: AlertType, target: string, condition: string, threshold?: number): string => {
			const id = generateAlertId();
			const alert: Alert = {
				id,
				type,
				target,
				condition,
				threshold,
				status: 'WATCHING',
				createdAt: Date.now()
			};

			update((state) => ({
				...state,
				alerts: [...state.alerts, alert]
			}));

			return id;
		},

		removeAlert: (id: string) => {
			update((state) => ({
				...state,
				alerts: state.alerts.filter((alert) => alert.id !== id)
			}));
		},

		triggerAlert: (id: string) => {
			update((state) => {
				const alerts = state.alerts.map((alert) => {
					if (alert.id === id) {
						const triggered = {
							...alert,
							status: 'TRIGGERED' as AlertStatus,
							triggeredAt: Date.now()
						};
						return triggered;
					}
					return alert;
				});

				const triggeredAlert = alerts.find((a) => a.id === id) || null;

				return {
					...state,
					alerts,
					lastTriggered: triggeredAlert
				};
			});
		},

		clearTriggered: () => {
			update((state) => ({
				...state,
				alerts: state.alerts.filter((alert) => alert.status !== 'TRIGGERED')
			}));
		},

		clearAll: () => {
			update((state) => ({
				...state,
				alerts: []
			}));
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const alerts = createAlertsStore();

// Derived stores
export const activeAlerts = derived(alerts, ($alerts) =>
	$alerts.alerts.filter((alert) => alert.status === 'WATCHING')
);

export const triggeredAlerts = derived(alerts, ($alerts) =>
	$alerts.alerts.filter((alert) => alert.status === 'TRIGGERED')
);

export const alertCount = derived(alerts, ($alerts) => $alerts.alerts.length);

export const activeAlertCount = derived(activeAlerts, ($active) => $active.length);
