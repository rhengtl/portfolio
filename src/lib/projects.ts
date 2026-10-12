import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

const STATUS_LABEL: Record<Project['data']['status'], string> = {
  live: 'Live',
  released: 'Released',
  thesis: 'Thesis',
  prototype: 'Prototype',
};

/** Published projects in display order (getCollection order is not guaranteed). */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** "2025–26" or "2026". */
export function yearRange({ start, end }: Project['data']['timeline']): string {
  const from = start.getUTCFullYear();
  const to = (end ?? start).getUTCFullYear();
  return from === to ? String(from) : `${from}–${String(to).slice(-2)}`;
}

/** Mono label above a project title, e.g. "Thesis · Team of 4 · 2025–26". */
export function projectLabel(project: Project): string {
  const { status, scope, timeline } = project.data;
  return [STATUS_LABEL[status], scope, yearRange(timeline)].join(' · ');
}

/** A case-study page exists only when the entry has a body (PORTFOLIO_SPEC §9.2). */
export function hasCaseStudy(project: Project): boolean {
  return Boolean(project.body?.trim());
}

export function projectAnchor(id: string): string {
  return `project-${id}`;
}

export interface EvidenceLink {
  label: string;
  href: string;
}

/** Public evidence links in a fixed order; only links that exist are returned. */
export function evidenceLinks(project: Project): EvidenceLink[] {
  const { links } = project.data;
  const out: EvidenceLink[] = [];
  if (links.live) out.push({ label: 'Live app', href: links.live });
  if (links.paper) out.push({ label: 'Thesis paper', href: links.paper });
  if (links.video) out.push({ label: 'Demo video', href: links.video });
  if (links.repo) out.push({ label: 'Code', href: links.repo });
  if (links.release) out.push({ label: 'Release', href: links.release });
  return out;
}
