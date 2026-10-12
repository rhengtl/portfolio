/**
 * Personal data and site-wide settings — PORTFOLIO_SPEC §6 and §18.3.
 * This is the one place to edit identity, links and navigation.
 */

export interface NavItem {
  label: string;
  /** In-page anchor on the home page, e.g. "#projects". */
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail';
}

export const site = {
  name: 'Rhenier Gustilo',
  shortName: 'RG',
  title: 'Software Engineer: Machine Learning & Backend',
  /** Used in <title> and social previews. */
  seoTitle: 'Rhenier Gustilo — Software Engineer (ML & Backend)',
  description:
    'Rhenier Gustilo, Computer Engineering graduate building ML and backend systems: real-time speech AI, LLM services, and offline-first apps.',
  mission:
    'I build AI-powered software end to end: real-time speech pipelines on a Raspberry Pi, LLM services at the edge, and offline-first apps people use every day.',
  education: {
    degree: 'BS Computer Engineering',
    specialization: 'Machine Learning specialization',
    school: 'Polytechnic University of the Philippines',
    location: 'Sta. Mesa, Manila',
    graduated: 'September 2026',
    honors: "President's Lister",
  },
  availability: 'Based in the Philippines · open to on-site roles in the Philippines and remote roles',
  coreStack: ['Python', 'PyTorch', 'scikit-learn', 'LLM APIs', 'FastAPI', 'TypeScript', 'PostgreSQL'],
  email: 'rheniergustilo06@gmail.com',
  github: 'https://github.com/RhenGTL',
  kaggle: 'https://www.kaggle.com/rhengtl',
  /** Set once the owner provides it (PORTFOLIO_SPEC §27.1). Icons render only when set. */
  linkedin: undefined as string | undefined,
  /** Public path of the résumé PDF; the button renders only if the file exists (§27.1). */
  resumePath: '/Rhenier-Gustilo-Resume.pdf',
  /** Public repo of this site; the footer "view source" link renders only when set. */
  sourceRepo: undefined as string | undefined,
  lastUpdated: '2026-10',
} as const;

export const nav: NavItem[] = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const socials: SocialLink[] = [
  { label: 'GitHub', href: site.github, icon: 'github' },
  ...(site.linkedin ? [{ label: 'LinkedIn', href: site.linkedin, icon: 'linkedin' as const }] : []),
  { label: 'Email', href: `mailto:${site.email}`, icon: 'mail' },
];
