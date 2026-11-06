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
  name: 'Rhenier R. Gustilo',
  shortName: 'RG',
  title: 'Software Engineer | AI Applications & Backend Development',
  /** Used in <title> and social previews. */
  seoTitle: 'Rhenier R. Gustilo — Software Engineer | AI & Backend',
  description:
    'Rhenier R. Gustilo builds AI applications, backend APIs and data-driven software. Explore projects, engineering case studies and a resume for full-time roles.',
  mission:
    'I build applications that connect AI features to backend services, APIs and reliable data flows. My projects combine LLM integrations, offline-first software and speech processing, with tests and documented evaluation.',
  education: {
    degree: 'BS Computer Engineering',
    specialization: 'Machine Learning specialization',
    school: 'Polytechnic University of the Philippines',
    location: 'Sta. Mesa, Manila',
    graduated: 'September 2026',
    honors: 'President’s Lister',
  },
  availability:
    'Based in the Philippines · seeking permanent, full-time software engineering roles',
  coreStack: ['Python', 'LLM APIs', 'FastAPI', 'TypeScript', 'PostgreSQL'],
  email: 'rheniergustilo06@gmail.com',
  github: 'https://github.com/RhenGTL',
  kaggle: 'https://www.kaggle.com/rhengtl',
  /** Set once the owner provides it. Icons render only when set. */
  linkedin: 'https://www.linkedin.com/in/rhengtl/' as string | undefined,
  /** Public path of the résumé PDF; the button renders only if the file exists (§27.1). */
  resumePath: '/Rhenier-Gustilo-Resume-AI-Applications-Backend.pdf',
  /** Public repo of this site; the footer "view source" link renders only when set. */
  sourceRepo: 'https://github.com/rhengtl/portfolio' as string | undefined,
  lastUpdated: '2026-11',
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
  'My internships developed practical habits in troubleshooting, systems deployment, documentation and handover that I bring to software projects.';

export const experience: ExperienceEntry[] = [
  {
    role: 'IT & Security Systems Intern',
    org: 'WJS Inc.',
    orgNote: 'Webtek Advanced Technology and Security Solution',
    period: 'Jul–Sep 2025',
    bullets: [
      'Deployed and commissioned integrated security and building systems (CCTV, fire detection and alarm, public address, biometric access, LED walls and digital kiosks) for hospitals, government buildings and event venues.',
      'Set up and troubleshot the network infrastructure behind them: LAN cable testing and termination, port addressing, and switch/router fault isolation.',
      'Produced system design documentation (AutoCAD layouts, manuals and turnover reports) used for installation and client handover.',
    ],
  },
  {
    role: 'Technical Support Intern',
    org: 'RVCom Computer Trading',
    period: 'Jul–Sep 2024',
    bullets: [
      'Resolved hardware and software issues for 20+ clients a week using a systematic, step-by-step troubleshooting process.',
      'Kept structured service logs to track recurring issues and improve turnaround.',
    ],
  },
  {
    role: 'Web Design Intern (Work Immersion)',
    org: 'DOST – Philippine Nuclear Research Institute',
    period: 'Mar–Apr 2022',
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
    title: 'AI application integration',
    items: [
      'OpenAI & Gemini APIs',
      'Structured drafts, output checks & fallbacks',
      'Speech-to-text & streaming text-to-speech',
      'Pretrained OCR, VAD & speaker verification',
    ],
    usedIn: ['contex', 'tindabot', 'earprompt'],
    note: 'Integrated pretrained models and APIs; these projects do not train their underlying speech or language models.',
  },
  {
    title: 'Backend services & APIs',
    items: [
      'Python · FastAPI · Flask',
      'JavaScript / TypeScript · Cloudflare Workers',
      'REST APIs · WebSockets · streaming',
      'Authentication, rate limits & request validation',
    ],
    usedIn: ['contex', 'tindabot', 'earprompt', 'tomatosense'],
  },
  {
    title: 'Databases & offline data',
    items: [
      'SQL · PostgreSQL / Supabase',
      'Row-level security & database migrations',
      'IndexedDB / Dexie · event logs & sync',
      'Firebase Auth · Firestore',
    ],
    usedIn: ['tindabot', 'contex', 'earprompt'],
  },
  {
    title: 'Testing & delivery',
    items: [
      'Vitest · Playwright · Python reference tests',
      'Git · GitHub Actions',
      'Cloudflare · Vercel · Render',
      'Failure testing, device checks & validation logs',
    ],
    usedIn: ['contex', 'tindabot', 'tomatosense'],
    note: 'I use AI coding tools with code review, automated tests and device checks.',
  },
  {
    title: 'Application development',
    items: [
      'React · TypeScript · progressive web apps',
      'Flutter / Dart · Kotlin / Android',
      'WebAssembly integration',
      'C# · WPF · Win32 input APIs',
    ],
    usedIn: ['tindabot', 'contex', 'earprompt', 'textsnip', 'clickmap'],
  },
  {
    title: 'Applied machine learning',
    items: [
      'scikit-learn · OpenCV · NumPy',
      'PCA · SVM training & kernel comparison',
      'Evaluation splits, confusion matrices & per-class metrics',
      'PyTorch inference · ONNX Runtime Web',
    ],
    usedIn: ['tomatosense', 'contex', 'earprompt'],
    note: 'Trained the TomatoSense classifier. In ConTeX and EarPrompt, adapted or integrated pretrained models.',
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
  lead: 'I’m seeking permanent, full-time software engineering opportunities focused on AI applications and backend development. Contact me about a role or to discuss the engineering behind a project. Email is the fastest way to reach me.',
};
