import { getOrCreateSession, getSessionByDate } from '$lib/server/db/sessions';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const dateParam = url.searchParams.get('date');
	const today = new Date().toISOString().split('T')[0];
	const dateStr = dateParam ?? today;

	const date = new Date(dateStr + 'T00:00:00');

	await getOrCreateSession(date);
	const session = await getSessionByDate(date);

	return {
		session: session!,
		selectedDate: dateStr
	};
};
