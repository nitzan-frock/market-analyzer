/**
 * Loads .env, sets DATABASE_URL from DATABASE_URL_TEST, then runs the given command.
 * Usage: npx tsx scripts/db-test-run.ts prisma migrate dev
 *    or: npx tsx scripts/db-test-run.ts prisma migrate reset
 */
import 'dotenv/config';
import { spawnSync } from 'child_process';

const dbUrl = process.env.DATABASE_URL_TEST;
if (!dbUrl) {
	console.error('DATABASE_URL_TEST must be set in .env');
	process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error('Usage: npx tsx scripts/db-test-run.ts <command> [args...]');
	process.exit(1);
}

const result = spawnSync('npx', args, {
	env: { ...process.env, DATABASE_URL: dbUrl },
	stdio: 'inherit',
	shell: true
});
process.exit(result.status ?? 1);
