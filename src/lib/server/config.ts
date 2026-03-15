/**
 * Server-side config from environment.
 * Do not import in client-safe code.
 */

const env = typeof process !== 'undefined' ? process.env : undefined;

export const polygonConfig = {
	get apiKey(): string | undefined {
		return env?.POLYGON_API_KEY;
	},
	/** ES front-month or specific contract e.g. ESH25. Override via POLYGON_ES_TICKER if needed. */
	get esTicker(): string {
		return env?.POLYGON_ES_TICKER ?? 'ES';
	}
} as const;

export function hasPolygonApiKey(): boolean {
	return Boolean(polygonConfig.apiKey);
}
