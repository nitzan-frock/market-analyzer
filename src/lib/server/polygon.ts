/**
 * Massive.com (formerly Polygon.io) futures aggregates client.
 * Server-only: fetches OHLC bars and computes body high/low for session windows.
 */

import { polygonConfig, hasPolygonApiKey } from './config';

const API_BASE = 'https://api.massive.com';

/** Single OHLC bar from Polygon futures aggs (results[].*) */
export interface PolygonAggBar {
	open: number;
	high: number;
	low: number;
	close: number;
	window_start: number; // nanosecond Unix timestamp
}

export interface PolygonAggsResponse {
	status: string;
	results?: PolygonAggBar[];
	next_url?: string;
}

/** Body high/low for a session (from candle bodies only). */
export interface SessionBodyLevels {
	high: number | null;
	low: number | null;
}

export interface KeyLevelsResult {
	previousDay: SessionBodyLevels;
	overnight: SessionBodyLevels;
	premarket: SessionBodyLevels;
}

/**
 * Build Unix ms for a moment in US Eastern (ET).
 * Uses EST offset (UTC-5); for EDT (UTC-4) the result is 1 hour off.
 */
function etToUtcMs(
	year: number,
	month: number, // 1-12
	day: number,
	hour: number,
	min: number
): number {
	// EST = UTC-5 → UTC = ET + 5h. Use 4 for EDT (Mar–Nov) approximation by month.
	const offsetHours = month >= 3 && month <= 10 ? 4 : 5;
	return Date.UTC(year, month - 1, day, hour + offsetHours, min, 0, 0);
}

function utcMsToNanoseconds(ms: number): number {
	return ms * 1e6;
}

/**
 * Compute body high/low from bars: bodyHigh = max(open, close), bodyLow = min(open, close) per bar.
 */
function bodyHighLow(bars: PolygonAggBar[]): SessionBodyLevels {
	if (bars.length === 0) return { high: null, low: null };
	let bodyHigh = -Infinity;
	let bodyLow = Infinity;
	for (const b of bars) {
		const high = Math.max(b.open, b.close);
		const low = Math.min(b.open, b.close);
		if (high > bodyHigh) bodyHigh = high;
		if (low < bodyLow) bodyLow = low;
	}
	return { high: bodyHigh, low: bodyLow };
}

/**
 * Fetch aggs for a window and return body high/low. Paginates if next_url present.
 */
async function fetchBarsForWindow(
	apiKey: string,
	ticker: string,
	windowStartNs: number,
	windowEndNs: number
): Promise<PolygonAggBar[]> {
	const bars: PolygonAggBar[] = [];
	let url: string | null =
		`${API_BASE}/futures/v1/aggs/${encodeURIComponent(ticker)}` +
		`?resolution=1min` +
		`&window_start.gte=${windowStartNs}` +
		`&window_start.lte=${windowEndNs}` +
		`&limit=50000` +
		`&apiKey=${encodeURIComponent(apiKey)}`;

	while (url) {
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			console.error('[polygon] aggs error', res.status, text);
			return [];
		}
		const data = (await res.json()) as PolygonAggsResponse;
		if (data.results?.length) bars.push(...data.results);
		url = data.next_url ? `${data.next_url}&apiKey=${encodeURIComponent(apiKey)}` : null;
	}
	return bars;
}

/**
 * Get previous trading day (weekday before date in ET).
 */
function previousTradingDay(year: number, month: number, day: number): { y: number; m: number; d: number } {
	const d = new Date(year, month - 1, day);
	d.setDate(d.getDate() - 1);
	while (d.getDay() === 0 || d.getDay() === 6) {
		d.setDate(d.getDate() - 1);
	}
	return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}

/**
 * Fetch key levels (body high/low) for previous day RTH, overnight, and premarket.
 * Session windows (ET): previous day 09:30–16:00, overnight 16:00 prev–04:00 curr, premarket 04:00–09:30 curr.
 * @param dateStr Session date as YYYY-MM-DD (calendar day in ET).
 */
export async function fetchKeyLevels(dateStr: string): Promise<KeyLevelsResult | null> {
	if (!hasPolygonApiKey()) return null;
	const apiKey = polygonConfig.apiKey!;
	const ticker = polygonConfig.esTicker;

	const [y, m, d] = dateStr.split('-').map(Number);
	if (!y || !m || !d) return null;
	const prev = previousTradingDay(y, m, d);

	// Previous day RTH: 09:30 – 16:00 ET
	const prevRthStartMs = etToUtcMs(prev.y, prev.m, prev.d, 9, 30);
	const prevRthEndMs = etToUtcMs(prev.y, prev.m, prev.d, 16, 0);
	// Overnight: 16:00 prev – 04:00 curr
	const overnightStartMs = etToUtcMs(prev.y, prev.m, prev.d, 16, 0);
	const overnightEndMs = etToUtcMs(y, m, d, 4, 0);
	// Premarket: 04:00 – 09:30 curr
	const premarketStartMs = etToUtcMs(y, m, d, 4, 0);
	const premarketEndMs = etToUtcMs(y, m, d, 9, 30);

	const [prevBars, overnightBars, premarketBars] = await Promise.all([
		fetchBarsForWindow(
			apiKey,
			ticker,
			utcMsToNanoseconds(prevRthStartMs),
			utcMsToNanoseconds(prevRthEndMs)
		),
		fetchBarsForWindow(
			apiKey,
			ticker,
			utcMsToNanoseconds(overnightStartMs),
			utcMsToNanoseconds(overnightEndMs)
		),
		fetchBarsForWindow(
			apiKey,
			ticker,
			utcMsToNanoseconds(premarketStartMs),
			utcMsToNanoseconds(premarketEndMs)
		)
	]);

	return {
		previousDay: bodyHighLow(prevBars),
		overnight: bodyHighLow(overnightBars),
		premarket: bodyHighLow(premarketBars)
	};
}
