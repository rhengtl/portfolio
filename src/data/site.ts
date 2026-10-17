/**
 * Personal data and site-wide settings.
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
    'Rhenier Gustilo, software engineer and Computer Engineering graduate building machine-learning systems, backend services and apps end to end.',
  mission:
    'I build complete software, from machine-learning models and LLM features to the backend services, APIs and apps around them, and I test and measure what I ship.',
  education: {
    degree: 'BS Computer Engineering',
    specialization: 'Machine Learning specialization',
    school: 'Polytechnic University of the Philippines',
    location: 'Sta. Mesa, Manila',
    graduated: 'September 2026',
    honors: 'President’s Lister',
  },
  availability:
    'Based in the Philippines · open to on-site roles in the Philippines and remote roles',
  coreStack: [
    'Python',
    'PyTorch',
    'scikit-learn',
    'LLM APIs',
    'FastAPI',
    'TypeScript',
    'PostgreSQL',
  ],
  email: 'rheniergustilo06@gmail.com',
  github: 'https://github.com/RhenGTL',
  kaggle: 'https://www.kaggle.com/rhengtl',
  /** Set once the owner provides it. Icons render only when set. */
  linkedin: 'https://www.linkedin.com/in/rhengtl/' as string | undefined,
  /** Public path of the résumé PDF; the button renders only if the file exists (§27.1). */
  resumePath: '/Rhenier-Gustilo-Resume.pdf',
  /** Public repo of this site; the footer "view source" link renders only when set. */
  sourceRepo: 'https://github.com/rhengtl/portfolio' as string | undefined,
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

/* ------------------------------------------------------------------ */
/* Home-page content              */
/* ------------------------------------------------------------------ */

/** Project ids (file names in src/content/projects) used for "used in" links. */
export type ProjectId =
  'earprompt' | 'contex' | 'tindabot' | 'tomatosense' | 'textsnip' | 'clickmap';

export interface ExperienceEntry {
  role: string;
  org: string;
  /** Short display form of the organisation for narrow screens, optional. */
  orgNote?: string;
  period: string;
  /** Website shows 2–3 bullets (§13.3); the résumé carries the full set. */
  bullets: string[];
}

export const experienceIntro =
  'Before building software full-time, I deployed and supported real systems in hospitals, government buildings and offices.';

export const experience: ExperienceEntry[] = [
  {
    role: 'IT & Security Systems Intern',
    org: 'WJS Inc.',
    orgNote: 'Webtek Advanced Technology and Security Solution',
    period: '2025',
    bullets: [
      'Deployed and commissioned integrated security and building systems (CCTV, fire detection and alarm, public address, biometric access, LED walls and digital kiosks) for hospitals, government buildings and event venues.',
      'Set up and troubleshot the network infrastructure behind them: LAN cable testing and termination, port addressing, and switch/router fault isolation.',
      'Produced system design documentation (AutoCAD layouts, manuals and turnover reports) used for installation and client handover.',
    ],
  },
  {
    role: 'Technical Support Intern',
    org: 'RVCom Computer Trading',
    period: '2024',
    bullets: [
      'Resolved hardware and software issues for 20+ clients a week using a systematic, step-by-step troubleshooting process.',
      'Kept structured service logs to track recurring issues and improve turnaround.',
    ],
  },
  {
    role: 'Web Design Intern (Work Immersion)',
    org: 'DOST – Philippine Nuclear Research Institute',
    period: '2022',
    bullets: [
      'Redesigned UI components of government web applications to improve accessibility.',
      'Tested and debugged UI/UX issues before deployment.',
    ],
  },
];

export interface SkillGroup {
  title: string;
  items: string[];
  /** Projects that demonstrate the group; rendered as links to the project blocks. */
  usedIn?: ProjectId[];
  /** Evidence that is not a project, e.g. internships. */
  note?: string;
  secondary?: boolean;
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Machine learning & AI',
    items: [
      'PyTorch (speech models)',
      'scikit-learn',
      'OpenCV',
      'TensorFlow / Keras',
      'NumPy · pandas',
      'SpeechBrain speaker verification',
      'Silero VAD',
      'Praat / Parselmouth',
      'ONNX Runtime Web',
      'Tesseract · ML Kit OCR',
      'LLM APIs (OpenAI, Gemini)',
      'Prompt design & output guardrails',
    ],
    usedIn: ['earprompt', 'contex', 'tindabot', 'tomatosense', 'textsnip'],
  },
  {
    title: 'Backend & APIs',
    items: [
      'FastAPI',
      'Flask',
      'REST API design',
      'WebSockets & streaming',
      'Cloudflare Workers, Durable Objects, KV',
      'Vercel serverless functions',
      'Auth: Firebase Auth, Google OAuth, JWT/RS256',
      'Rate limiting',
    ],
    usedIn: ['contex', 'earprompt', 'tindabot', 'tomatosense'],
  },
  {
    title: 'Data & storage',
    items: [
      'PostgreSQL with Row Level Security (Supabase)',
      'SQL',
      'Firestore & security rules',
      'IndexedDB (Dexie)',
      'Event-sourced data models',
    ],
    usedIn: ['tindabot', 'contex', 'earprompt'],
  },
  {
    title: 'Languages',
    items: [
      'Python',
      'TypeScript',
      'JavaScript',
      'SQL',
      'Dart',
      'C#',
      'Kotlin',
      'C++',
      'R',
      'Verilog HDL',
    ],
  },
  {
    title: 'Frontend & mobile',
    items: [
      'React · Vite · Zustand',
      'Progressive web apps',
      'Flutter',
      'Android (MediaProjection, overlays)',
      'WPF / .NET',
      'WebAssembly integration',
      'HTML/CSS',
    ],
    usedIn: ['tindabot', 'earprompt', 'textsnip', 'clickmap', 'contex'],
  },
  {
    title: 'DevOps & quality',
    items: [
      'Git · GitHub Actions CI/CD',
      'Vitest · Playwright',
      'Python unit tests',
      'Linux',
      'Docker',
      'Vercel · Render · Cloudflare · Firebase',
      'Specs, architecture docs, validation logs',
    ],
    usedIn: ['contex', 'tindabot', 'tomatosense'],
  },
  {
    title: 'AI-assisted development',
    items: ['Claude Code (Anthropic)', 'Reviewing and testing AI-generated code'],
    usedIn: ['earprompt', 'contex', 'tindabot', 'tomatosense', 'textsnip', 'clickmap'],
    note: 'AI output is a draft; tests and device checks decide what ships. Testing ConTeX on mobile data, I found PDF previews timing out on slow links; the root-cause fix shipped with a new compile test suite.',
  },
  {
    title: 'Embedded & hardware',
    items: ['Raspberry Pi 5 (GPIO, I²C sensors, audio I/O)', 'Arduino / ESP', 'Verilog HDL'],
    usedIn: ['earprompt'],
  },
  {
    title: 'Networking & systems',
    items: [
      'Switching, routing & wireless fundamentals',
      'LAN cabling & testing',
      'IP / port addressing',
      'Cisco Packet Tracer',
      'Security & building systems deployment',
    ],
    note: 'From internships and Cisco Networking Academy',
    secondary: true,
  },
  {
    title: 'Design & documentation',
    items: ['AutoCAD', 'Adobe Photoshop', 'Technical documentation'],
    note: 'From internships',
    secondary: true,
  },
];

export const about = {
  paragraphs: [
    'I’m a Computer Engineering graduate from the Polytechnic University of the Philippines, where I specialized in machine learning.',
    'What I enjoy most is the step from “it works” to “it holds up”: turning a model or prototype into dependable software, from the services and APIs behind it to the interface people use.',
    'My internships in systems deployment and technical support showed me how things fail in the field, so my projects ship with tests, validation logs and fallbacks.',
  ],
  thesis: {
    title: 'EarPrompt: A Real-Time Conversational AI Assistant for Enhancing Verbal Communication',
    href: 'https://drive.google.com/file/d/1P69KKB13oHfeHU089pQ5AMQEtUyjJy2s/view?usp=sharing',
    note: 'Team of 4 · advisers Engr. Rolito L. Mahaguay and Engr. Ferdinand O. Natividad',
  },
};

export interface Credential {
  name: string;
  issuer: string;
  year: string;
  /** Public verification page, when one exists. */
  href?: string;
  /** Extra wording that keeps the credential precise, e.g. "course certificate". */
  kind?: string;
}

export const credentials: Credential[] = [
  {
    name: 'Machine Learning with Python',
    issuer: 'freeCodeCamp',
    year: '2026',
    kind: 'Developer Certification',
    href: 'https://freecodecamp.org/certification/rhengtl/machine-learning-with-python-v7',
  },
  {
    name: 'Hugging Face Agents Course',
    issuer: 'Hugging Face',
    year: '2026',
    kind: 'Certificate of completion',
  },
  {
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS Training & Certification',
    year: '2026',
    kind: 'Course completion certificate',
  },
  {
    name: 'Intro to Machine Learning',
    issuer: 'Kaggle Learn',
    year: '2026',
    href: 'https://www.kaggle.com/learn/certification/rhengtl/intro-to-machine-learning',
  },
  {
    name: 'Intermediate Machine Learning',
    issuer: 'Kaggle Learn',
    year: '2026',
    href: 'https://www.kaggle.com/learn/certification/rhengtl/intermediate-machine-learning',
  },
  {
    name: 'Intro to Deep Learning',
    issuer: 'Kaggle Learn',
    year: '2026',
    href: 'https://www.kaggle.com/learn/certification/rhengtl/intro-to-deep-learning',
  },
  {
    name: 'Computer Vision',
    issuer: 'Kaggle Learn',
    year: '2026',
    href: 'https://www.kaggle.com/learn/certification/rhengtl/computer-vision',
  },
  {
    name: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco Networking Academy',
    year: '2025',
    kind: 'Course certificate',
  },
];

export const activities = [
  'Technical Committee, “Beyond the CpEctrum” seminar series, PUP Computer Engineering (2026)',
];

export const contact = {
  lead: 'I’m looking for software engineering, machine learning and backend roles, in the Philippines or remote. Email is the fastest way to reach me.',
};
