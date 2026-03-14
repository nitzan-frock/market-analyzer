import { sessionService } from '$lib/server/services/session.service';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const dateParam = url.searchParams.get('date');
	const today = new Date().toISOString().split('T')[0];
	const dateStr = dateParam ?? today;

	const date = new Date(dateStr + 'T00:00:00');

	await sessionService.getOrCreate(date);
	const session = await sessionService.getByDate(date);

	return {
		session: session!,
		selectedDate: dateStr
	};
};
