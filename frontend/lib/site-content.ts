export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  year: string;
  /** Tile + modal hero art for Repositories (`frontend/public`). */
  thumbSrc?: string;
  links?: { label: string; href: string }[];
};

export type PortfolioWorkItem = {
  id: string;
  title: string;
  period: string;
  description: string;
  /** Cover art for Projects grid + detail sheet (`frontend/public`). */
  thumbSrc?: string;
};

export type CertificationItem = {
  id: string;
  year: string;
  title: string;
  ctaLabel: string;
  href: string;
  /** Badge art for grid + detail sheet (served from `frontend/public`). */
  badgeSrc?: string;
};

export type ExperienceRole = {
  id: string;
  company: string;
  title: string;
  period: string;
  bullets: string[];
  /** Shown on experience grid tiles and in the detail sheet (e.g. `/data-axle-logo.png`). */
  companyLogoSrc?: string;
};

export type Highlight = {
  id: string;
  /** Short label under the ring (keep concise for layout). */
  label: string;
  emoji: string;
  /** Heading inside the detail popup (defaults to `label`). */
  title?: string;
  summary?: string;
  body?: string;
  /** Primary link (e.g. LinkedIn post). */
  href?: string;
  ctaLabel?: string;
  /** Illustration shown in the popup. */
  imageSrc?: string;
  imageAlt?: string;
  /** Static file in `frontend/public` (e.g. `.pptx`). */
  attachmentHref?: string;
  attachmentLabel?: string;
};

/** Public repos listing — source for repository tiles. */
export const GITHUB_REPOS_URL =
  "https://github.com/Ayush2001hacker?tab=repositories";

const gh = (repo: string) => `https://github.com/Ayush2001hacker/${repo}`;

/** Served from `frontend/public` — PDF copied from your resume file. */
export const RESUME_PDF = "/Ayush_Bhagat_Resume.pdf";

/** Home-only contact row — update phone/LinkedIn/Gmail here. */
export const homeContact = {
  linkedinUrl: "https://www.linkedin.com/in/ayush-bhagat-00a79b22a/",
  phoneDisplay: "+91 70002 31599",
  phoneTel: "tel:+917000231599",
  gmailDisplay: "bhagatayush8818@gmail.com",
  gmailHref: "mailto:bhagatayush8818@gmail.com",
};

export const profile = {
  name: "Ayush Bhagat",
  fullName: "@Ayush2001hacker",
  handle: "ayush",
  verified: true,
  title: "Software Engineer · Data Axle",
  bio: "Software Engineer with 3.4+ years of experience building scalable frontend architectures, microfrontends, and cloud-native applications. Experienced in integrating HubSpot and Salesforce CRMs, optimizing performance, and leveraging AWS services. Salesforce Certified Developer and AWS Certified Cloud Practitioner.",
  photoSrc: "/ayush-portrait.png",
  location: "Pune, India · UTC+5:30",
  links: {
    github: "https://github.com/Ayush2001hacker",
    linkedin: homeContact.linkedinUrl,
    email: homeContact.gmailHref,
    resume: RESUME_PDF,
  },
  stats: [
    { label: "repos", value: "16" },
    { label: "years", value: "3.4+" },
    { label: "certifications", value: "3" },
  ] as const,
};

export const highlights: Highlight[] = [
  {
    id: "promotion-swe",
    label: "Promotion",
    emoji: "🚀",
    title: "Promotion to Software Engineer",
    summary:
      "Recognized by leadership at Data Axle India for impact and growth—stepping up to Software Engineer with gratitude for mentors and teammates who made the journey possible.",
    href: "https://www.linkedin.com/posts/ayush-bhagat-00a79b22a_grateful-for-the-recognition-and-trust-from-share-7450593119760175104-nVOl?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADls10oBjgYWfBoOcF7PSlzafmiZzl1QrM4",
    ctaLabel: "View on LinkedIn",
  },
  {
    id: "starlight-award",
    label: "Starlight",
    emoji: "🌟",
    title: "Starlight Award at Data Axle",
    summary:
      "Honored with the Starlight Award at Data Axle India—recognition for contribution, learning, and the support of leadership and colleagues.",
    href: "https://www.linkedin.com/posts/ayush-bhagat-00a79b22a_starlightaward-dataaxle-yourspacetogrow-share-7372343262382227457-YKVt?utm_source=share&utm_medium=member_desktop&rcm=ACoAADls10oBjgYWfBoOcF7PSlzafmiZzl1QrM4",
    ctaLabel: "View on LinkedIn",
  },
  {
    id: "barclays-hackathon",
    label: "Barclays",
    emoji: "🏦",
    title: "Barclays Hackathon — Reward sharing pool",
    summary:
      "Participated in the Barclays hackathon with a smart reward pooling concept—system architecture spanning ingestion flows, microservices, and caching.",
    imageSrc: "/highlight-barclays-hackathon.png",
    imageAlt: "System architecture diagram for ingestion and user flows",
    attachmentHref: "/highlight-barclays-offer-pooling.pptx",
    attachmentLabel: "Download deck (PPTX)",
  },
  {
    id: "metlife-hackathon",
    label: "MetLife",
    emoji: "🛡️",
    title: "MetLife Hackathon — Claim & fraud detection",
    summary:
      "Hackathon build for an insurance claim and fraud detection architecture—OCR ingestion, ML scoring, rules engine, and decision paths for auto-process vs manual review.",
    imageSrc: "/highlight-metlife-hackathon.png",
    imageAlt: "Insurance claim and fraud detection system architecture diagram",
  },
];

export type BlogPost = {
  id: string;
  title: string;
  date?: string;
  summary?: string;
  /** Optional cover image for the Blogs grid (`frontend/public/...`). */
  feedThumbSrc?: string;
  /** On-site post — markdown in `content/blogs/[slug].md` */
  slug?: string;
  /** External article (opens in a new tab) */
  href?: string;
};

/** Writing — “Blogs” nav; use `slug` + markdown file, or `href` only for external links. */
export const blogPosts: BlogPost[] = [
  {
    id: "microfrontend-architecture",
    slug: "microfrontend-architecture",
    title: "Microfrontend Architecture: How to Scale Frontend Like a Product Company",
    date: "April 2026",
    feedThumbSrc: "/blog-microfrontend-architecture.png",
    summary:
      "Why monoliths break at team scale, how microfrontends and Module Federation fit together, and when the pattern is worth the complexity.",
  },
];

/** GitHub repositories — “Repositories” tab */
export const projects: Project[] = [
  {
    id: "ayush-portfolio",
    title: "Ayush-Portfolio",
    subtitle: "Personal site",
    description:
      "This portfolio — Next.js frontend with an Instagram-inspired layout, Express-ready structure, and resume integration.",
    tags: ["TypeScript", "Next.js"],
    year: "2026",
    thumbSrc: "/repo-portfolio.png",
    links: [{ label: "Repository", href: gh("Ayush-Portfolio") }],
  },
  {
    id: "mycontacts-backend",
    title: "mycontacts-backend-nodejs-express",
    subtitle: "REST API",
    description:
      "Contacts backend built with Node.js and Express — CRUD, validation, and API design practice.",
    tags: ["JavaScript", "Node.js", "Express"],
    year: "2026",
    thumbSrc: "/repo-mycontacts-backend.png",
    links: [
      { label: "Repository", href: gh("mycontacts-backend-nodejs-express") },
    ],
  },
  {
    id: "birdbox-app",
    title: "birdbox-app",
    subtitle: "TypeScript app",
    description:
      "Application work in TypeScript — UI, modules, and app structure.",
    tags: ["TypeScript"],
    year: "2026",
    thumbSrc: "/repo-birdbox.png",
    links: [{ label: "Repository", href: gh("birdbox-app") }],
  },
  {
    id: "smart-reward",
    title: "smart-reward-pooling-system",
    subtitle: "Java",
    description: "Reward pooling logic and system design in Java.",
    tags: ["Java"],
    year: "2026",
    thumbSrc: "/repo-smart-reward.png",
    links: [{ label: "Repository", href: gh("smart-reward-pooling-system") }],
  },
  {
    id: "modern-mfe",
    title: "Modern.js_MFE",
    subtitle: "Micro-frontends",
    description:
      "Micro-frontend exploration with Modern.js — composition and build setup.",
    tags: ["TypeScript", "MFE"],
    year: "2026",
    thumbSrc: "/repo-modern-mfe.png",
    links: [{ label: "Repository", href: gh("Modern.js_MFE") }],
  },
  {
    id: "microfrontend-remix",
    title: "MicrofrontendRemixJs",
    subtitle: "Remix + MFE",
    description:
      "Microfrontend patterns using Remix — routing, islands, and integration.",
    tags: ["TypeScript", "Remix"],
    year: "2026",
    thumbSrc: "/repo-remix-microfrontend.png",
    links: [{ label: "Repository", href: gh("MicrofrontendRemixJs") }],
  },
  {
    id: "metlife-frontend",
    title: "Metlife-Frontend",
    subtitle: "Enterprise UI",
    description:
      "Frontend work for MetLife — forms, flows, and component-driven UI.",
    tags: ["TypeScript", "React"],
    year: "2025",
    thumbSrc: "/repo-metlife.png",
    links: [{ label: "Repository", href: gh("Metlife-Frontend") }],
  },
  {
    id: "ds-ml-sql",
    title: "DS-ML-SQL_Assignment",
    subtitle: "Notebooks",
    description:
      "Data science, ML, and SQL coursework captured in Jupyter notebooks.",
    tags: ["Jupyter", "Python", "SQL"],
    year: "2023",
    thumbSrc: "/repo-ds-ml.png",
    links: [{ label: "Repository", href: gh("DS-ML-SQL_Assignment") }],
  },
  {
    id: "open-ai",
    title: "open_AI",
    subtitle: "Python",
    description: "OpenAI API experiments and small utilities in Python.",
    tags: ["Python", "OpenAI"],
    year: "2023",
    thumbSrc: "/repo-open-ai.png",
    links: [{ label: "Repository", href: gh("open_AI") }],
  },
  {
    id: "automation",
    title: "Automation",
    subtitle: "Python scripts",
    description: "Automation scripts and tooling in Python.",
    tags: ["Python"],
    year: "2023",
    thumbSrc: "/repo-automation.png",
    links: [{ label: "Repository", href: gh("Automation") }],
  },
  {
    id: "react-app",
    title: "ReactApp",
    subtitle: "JavaScript / React",
    description:
      "Early React application — components, state, and SPA fundamentals.",
    tags: ["JavaScript", "React"],
    year: "2023",
    thumbSrc: "/repo-react-app.png",
    links: [{ label: "Repository", href: gh("ReactApp") }],
  },
  {
    id: "django-app",
    title: "Django_app",
    subtitle: "Python / Django",
    description:
      "Django web app — models, views, templates, and server-rendered pages.",
    tags: ["Python", "Django"],
    year: "2023",
    thumbSrc: "/repo-django.png",
    links: [{ label: "Repository", href: gh("Django_app") }],
  },
];

/** “Projects” tab — selected shipped work */
export const portfolioWorkItems: PortfolioWorkItem[] = [
  {
    id: "crm-mfe",
    title: "Microfrontend CRM dashboard with CRM integrations",
    period: "Jun 2025 – Nov 2025",
    description:
      "Built a microfrontend CRM dashboard (React.js, Next.js, Module Federation) with HubSpot and Salesforce integration, improving lead syncing workflows and cutting deployment downtime by 30%.",
    thumbSrc: "/project-crm-microfrontend.png",
  },
  {
    id: "sre-monitor",
    title: "SRE monitoring tool",
    period: "Apr 2024 – Jul 2024",
    description:
      "Built an internal API monitoring tool with React.js, Django, GraphQL, PostgreSQL, and MUI; improved issue detection and reduced resolution time by 40%.",
    thumbSrc: "/project-sre-monitoring.png",
  },
  {
    id: "email-ai",
    title: "Personalized email generation platform",
    period: "Jul 2023 – Aug 2023",
    description:
      "Created an AI-powered email generator using OpenAI APIs to produce context-aware, personalized marketing emails for CRM-captured leads (HubSpot, Salesforce), improving campaign CTR by 18%.",
    thumbSrc: "/project-email-generator.png",
  },
];

/** “Certifications” tab */
export const certifications: CertificationItem[] = [
  {
    id: "aws-cp",
    year: "2026",
    title: "AWS Certified Cloud Practitioner",
    ctaLabel: "View credential",
    href: "https://www.credly.com/badges/b377500f-9969-47d8-9f3b-6421953b1c21/public_url",
    badgeSrc: "/cert-aws-cloud-practitioner.png",
  },
  {
    id: "sf-js1",
    year: "2025",
    title: "Salesforce Certified JavaScript Developer I",
    ctaLabel: "Verify credential",
    href: "https://trailhead.salesforce.com/en/credentials/verification/",
    badgeSrc: "/cert-salesforce-js1.png",
  },
  {
    id: "sf-pd1",
    year: "2025",
    title: "Salesforce Certified Platform Developer I",
    ctaLabel: "Verify credential",
    href: "https://trailhead.salesforce.com/en/credentials/verification/",
    badgeSrc: "/cert-salesforce-pd1.png",
  },
];

/** “Experience” tab — three roles */
export const experienceRoles: ExperienceRole[] = [
  {
    id: "se-dataaxle",
    company: "Data Axle · Pune",
    title: "Software Engineer",
    period: "Apr 2025 – present",
    companyLogoSrc: "/data-axle-logo.png",
    bullets: [
      "Owns frontend system design for large-scale React and Next.js applications—lazy loading, code splitting, and SSR—improving Core Web Vitals (LCP, FCP) and reducing bundle size.",
      "Leads CRM integration direction with HubSpot and Salesforce, improving lead-sync workflows and cutting deployment downtime inherited from prior initiatives.",
      "Drives architecture for microfrontend surfaces, shared UI libraries, and secure CI/CD patterns (including AWS CodeArtifact) across federated services.",
      "Collaborates with cross-functional partners on performance budgets, monitoring, and scalable release processes.",
    ],
  },
  {
    id: "ase-dataaxle",
    company: "Data Axle · Pune",
    title: "Associate Software Engineer",
    period: "Jul 2023 – Mar 2025",
    companyLogoSrc: "/data-axle-logo.png",
    bullets: [
      "Implemented a microfrontend architecture using Webpack Module Federation in a large-scale Nx monorepo, enabling independent deployments and reducing release cycle time by 25%.",
      "Integrated HubSpot and Salesforce CRM systems, automating lead capture and synchronization workflows and reducing manual data entry by 80%.",
      "Developed 10+ reusable React.js components using Material UI, improving UI performance and increasing user engagement by 35%.",
      "Built Next.js SSR pages and API routes to improve SEO and application performance, reducing first-page load time by 40%.",
      "Refactored 50+ legacy React components into modern hooks-based architecture with improved state management patterns, reducing code complexity by 20%.",
      "Designed a shared UI component library used across 3+ internal applications, ensuring design consistency and reducing duplicate code.",
      "Architected frontend system design for high-performance React applications, leveraging lazy loading, code splitting, and SSR, improving Core Web Vitals (LCP, FCP) by 35% and reducing bundle size by 30%.",
      "Implemented AWS CodeArtifact for secure package management and automated CI/CD authentication across microfrontend services.",
    ],
  },
  {
    id: "intern-dataaxle",
    company: "Data Axle · Remote",
    title: "Software Developer Intern",
    period: "Feb 2023 – Jun 2023",
    companyLogoSrc: "/data-axle-logo.png",
    bullets: [
      "Developed 3 interactive React.js dashboards with Material UI, enabling real-time analytics for 50+ sales representatives.",
      "Contributed to Jira-based Agile sprints, delivering features 10% faster through cross-team collaboration.",
    ],
  },
];

export type StackSection = { title: string; body: string };

export const stackSections: StackSection[] = [
  {
    title: "Frontend & state",
    body: "React.js, Next.js, JavaScript (ES6+), TypeScript, HTML, Tailwind CSS, Material UI, Redux",
  },
  {
    title: "Backend",
    body: "Node.js, Express, Django, REST APIs, GraphQL",
  },
  {
    title: "Bundling & architecture",
    body: "Webpack, Module Federation, microfrontends, system design, scalable systems",
  },
  {
    title: "Tools",
    body: "Git, Postman, Docker, Jira, Jest, React Testing Library, AWS CodeArtifact, Chrome DevTools",
  },
  {
    title: "Programming & APIs",
    body: "JavaScript, TypeScript, Python, GraphQL, REST",
  },
  {
    title: "Cloud",
    body: "AWS (EC2, S3, IAM, CloudWatch, RDS, VPC, shared responsibility model, monitoring & logging)",
  },
  {
    title: "Practices",
    body: "Agile, CI/CD, performance optimization, test-driven development (TDD)",
  },
];

export const timeline = [
  {
    year: "Apr 2025 – present",
    role: "Software Engineer",
    org: "Data Axle · Pune",
    detail:
      "Frontend system design, CRM integrations, microfrontends, performance, and AWS CodeArtifact.",
  },
  {
    year: "Jul 2023 – Mar 2025",
    role: "Associate Software Engineer",
    org: "Data Axle · Pune",
    detail:
      "Module Federation in Nx, HubSpot & Salesforce, React/Next.js, shared UI libraries, and Core Web Vitals work.",
  },
  {
    year: "Feb 2023 – Jun 2023",
    role: "Software Developer Intern",
    org: "Data Axle · Remote",
    detail:
      "React.js dashboards with Material UI and Jira-based Agile delivery.",
  },
];
