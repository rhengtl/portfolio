import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '@/data/site';

/**
 * The résumé button renders only when the PDF exists,
 * so the site never links to a missing file. Checked at build time from the project root.
 */
export const hasResume: boolean = existsSync(join(process.cwd(), 'public', site.resumePath));
