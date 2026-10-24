/**
 * Single source of truth for every fact on the site.
 *
 * Sources (verified 24 Oct 2026):
 *  - Devpost profile   https://devpost.com/karthikma321  (12 projects · 57 hackathons · 7 winner ribbons)
 *  - Devpost project pages (taglines, "built with", prize lists)
 *  - GitHub            https://github.com/sleader3221-dot (repos + Kavacha-AI README)
 *  - v1 portfolio copy (education, certifications, contact)
 *
 * Edit here; components only render this data.
 */

export const person = {
  name: "Karthik M Achalakar",
  firstName: "Karthik",
  initials: "KMA",
  role: "Software · AI/ML · DFIR Engineer",
  roles: ["Software Engineer", "AI/ML Builder", "DFIR Engineer"],
  location: "Bengaluru, India",
  coords: "12.9716° N, 77.5946° E",
  timezone: "Asia/Kolkata",
  caseId: "KMA-2026",
  availability: "Open to internships",
  interests: ["Software Engineering", "AI/ML", "Cybersecurity / DFIR"],
  statement:
    "I build evidence-driven intelligent systems — from autonomous forensic triage agents to award-winning fintech products — engineered for trust, clarity and measurable results.",
  email: "karthikma704@gmail.com",
  phone: { display: "+91 96061 68200", href: "tel:+919606168200" },
} as const;

export const links = {
  github: "https://github.com/sleader3221-dot",
  linkedin: "https://linkedin.com/in/karthik-ma",
  devpost: "https://devpost.com/karthikma321",
} as const;

export type Stat = { value: number; decimals?: number; suffix?: string; label: string; note: string };

export const stats: Stat[] = [
  { value: 57, label: "Hackathons entered", note: "Devpost profile" },
  { value: 12, label: "Published projects", note: "Devpost profile" },
  { value: 7, label: "Winner ribbons", note: "Devpost profile" },
  { value: 8.45, decimals: 2, label: "CGPA / 10", note: "B.E. · RIT Bengaluru" },
];
export const statsAsOf = "Devpost · Oct 2026";

export type Award = { title: string; event: string };

export type Project = {
  id: string;
  code: string;
  title: string;
  domain: string;
  year: string;
  tagline: string;
  context?: string;
  awards: Award[];
  ribbon: boolean;
  stack: string[];
  image: string;
  accent: string;
  live: string;
  devpost?: string;
  source?: string;
};

export const projects: Project[] = [
  {
    id: "proofsift",
    code: "03-A",
    title: "ProofSIFT",
    domain: "DFIR · Autonomous agent",
    year: "2026",
    tagline:
      "Evidence-proven autonomous DFIR triage that confirms findings only with traceable forensic artifacts, self-corrects weak claims, and generates audit-ready reports with SQLite provenance.",
    context: "Built for the SANS Find Evil hackathon",
    awards: [
      { title: "3rd Place · 2nd Runner-Up", event: "SS Hacker Team Cybersecurity Global Challenge 2026" },
      { title: "Black Hat Champion", event: "Black Hat Team" },
      { title: "2nd Prize · Runner-Up", event: "Global Tech Innovation 2026" },
      { title: "Special Prize · Iteration Machine", event: "DSH Hacks V1" },
    ],
    ribbon: true,
    stack: ["Python", "TypeScript", "SQLite", "MCP", "MITRE ATT&CK", "EVTX"],
    image: "/images/work/proofsift.webp",
    accent: "#ff5a1f",
    live: "https://proof-sift.vercel.app/",
    devpost: "https://devpost.com/software/proofsift",
    source: "https://github.com/sleader3221-dot/ProofSIFT",
  },
  {
    id: "civora",
    code: "03-B",
    title: "Civora",
    domain: "Site safety · AI command center",
    year: "2026",
    tagline:
      "AI command center catching safety risks 18 min early, cutting 142 tCO₂e, turning every site decision into accountable action.",
    awards: [
      { title: "Special Prize · Iteration Machine", event: "DSH Hacks V1" },
      { title: "Special Award · InterviewCake", event: "DSH Hacks V1" },
      { title: "Top 20 Finalist", event: "Build Beyond Hackathon" },
    ],
    ribbon: true,
    stack: ["React", "TypeScript", "Vite", "PWA · Workbox", "Recharts", "Vitest"],
    image: "/images/work/civora.webp",
    accent: "#c8ff4d",
    live: "https://civora-zeta.vercel.app/",
    devpost: "https://devpost.com/software/civora",
    source: "https://github.com/sleader3221-dot/CIVORA",
  },
  {
    id: "finwise",
    code: "03-C",
    title: "Fin Wise",
    domain: "Fintech · Financial literacy",
    year: "2026",
    tagline:
      "Gamified financial literacy for teens — learn budgeting, saving, and investing through interactive lessons and simulated markets.",
    awards: [
      { title: "2nd Overall", event: "HackMars 3.0: NEON" },
      { title: "Special Prize · Iteration Machine", event: "DSH Hacks V1" },
    ],
    ribbon: true,
    stack: ["React", "TypeScript", "Python", "FastAPI", "scikit-learn", "Solidity", "Tailwind CSS"],
    image: "/images/work/finwise.webp",
    accent: "#34d399",
    live: "https://fin-wise-swart.vercel.app/",
    devpost: "https://devpost.com/software/fin-wise-o9p4av",
    source: "https://github.com/sleader3221-dot/Fin_Wise",
  },
  {
    id: "neuroflow",
    code: "03-D",
    title: "NeuroFlow AI",
    domain: "EdTech · Adaptive learning",
    year: "2026",
    tagline:
      "A unified, AI-powered study space that adapts to you with spaced-repetition flashcards, custom quizzes, note analysis and physics-based knowledge graphs.",
    awards: [{ title: "Special Prize · Iteration Machine", event: "DSH Hacks V1" }],
    ribbon: true,
    stack: ["React", "Vite", "React Router", "Recharts", "SM-2", "LocalStorage"],
    image: "/images/work/neuroflow.webp",
    accent: "#8b7bff",
    live: "https://neuro-flow-rnn5.vercel.app/",
    devpost: "https://devpost.com/software/neuroflow-ai-m4h6pi",
    source: "https://github.com/sleader3221-dot/Neuro_Flow",
  },
  {
    id: "nexusai",
    code: "03-E",
    title: "NexusAI",
    domain: "Fintech · Command center",
    year: "2026",
    tagline:
      "An AI-powered financial intelligence platform with real-time portfolio optimization, behavioral-biometrics fraud detection, and multi-framework compliance monitoring in one command center.",
    awards: [{ title: "Participation Prize", event: "DSH Hacks V1" }],
    ribbon: true,
    stack: ["JavaScript", "Chart.js", "Web Speech API", "HTML5", "CSS3"],
    image: "/images/work/nexusai.webp",
    accent: "#2ee6d6",
    live: "https://nexus-ai-peach-theta.vercel.app/",
    devpost: "https://devpost.com/software/nexusai-autonomous-fintech-command-center",
    source: "https://github.com/sleader3221-dot/nexus-ai",
  },
  {
    id: "shieldnet",
    code: "03-F",
    title: "ShieldNet",
    domain: "Security · Web3",
    year: "2026",
    tagline:
      "AI-powered decentralized cybersecurity & fintech intelligence platform — real-time AI threat detection meets blockchain security.",
    awards: [{ title: "Winner · Membership", event: "Impact Creation" }],
    ribbon: true,
    stack: ["Next.js 14", "TypeScript", "Python", "FastAPI", "scikit-learn", "Solidity", "WebSockets", "Docker"],
    image: "/images/work/shieldnet.webp",
    accent: "#b18cff",
    live: "https://shield-net-three.vercel.app/",
    devpost: "https://devpost.com/software/shieldnet-cagprz",
    source: "https://github.com/sleader3221-dot/ShieldNet",
  },
  {
    id: "nivesh",
    code: "03-G",
    title: "Nivesh AI",
    domain: "Fintech · Explainable AI",
    year: "2026",
    tagline:
      "Empowering retail investors with secure, risk-matched stock simulations and explainable AI insights.",
    awards: [{ title: "Participation Prize", event: "DSH Hacks V1" }],
    ribbon: true,
    stack: ["Python", "FastAPI", "XGBoost", "SHAP", "PostgreSQL", "JWT", "Docker"],
    image: "/images/work/nivesh.webp",
    accent: "#3ba8ff",
    live: "https://final-prototype-eta.vercel.app/",
    devpost: "https://devpost.com/software/nivesh-ai",
    source: "https://github.com/sleader3221-dot/final_prototype",
  },
  {
    id: "kavacha",
    code: "03-H",
    title: "Kavacha AI",
    domain: "GovTech · Crime intelligence",
    year: "2026",
    tagline:
      "A Kannada-first, explainable crime-intelligence copilot for authorised Karnataka State Police workflows — hotspot maps, GraphRAG case networks and audit-hashed mission briefs.",
    awards: [],
    ribbon: false,
    stack: ["TypeScript", "MapLibre", "Cytoscape", "GraphRAG", "SSE", "Zoho Catalyst"],
    image: "/images/work/kavacha.webp",
    accent: "#e3a64a",
    live: "https://kavacha-ai.vercel.app/",
    source: "https://github.com/sleader3221-dot/Kavacha-AI",
  },
];

export type Discipline = { id: string; title: string; kicker: string; body: string; tools: string[] };

export const disciplines: Discipline[] = [
  {
    id: "ai",
    title: "AI / ML Engineering",
    kicker: "Intelligent systems & agents",
    body: "Evidence-driven AI systems: autonomous forensic triage agents, adaptive learning platforms and fraud-operations tools — built with LLM integrations, NLP workflows and measurable precision benchmarks.",
    tools: ["Python", "FastAPI", "LLM Integration", "NLP Workflows", "scikit-learn", "SQLite", "Docker"],
  },
  {
    id: "dfir",
    title: "Software & DFIR",
    kicker: "Full-stack & cybersecurity engineering",
    body: "Full-stack web applications (React, Next.js, Node.js) and digital-forensics tooling — from case-management platforms to incident-response pipelines using MITRE ATT&CK, YARA, EVTX and SHA-256 evidence integrity.",
    tools: ["React", "Next.js", "TypeScript", "AWS DynamoDB", "MITRE ATT&CK", "DFIR", "Vercel"],
  },
];

/** The six-stage loop engineered into ProofSIFT — and the way every project here is built. */
export const method = [
  { verb: "Plan", body: "Frame the question, the threat model and what “done” has to prove — before a line of code." },
  { verb: "Collect", body: "Ingest raw artifacts — logs, EVTX, market feeds, learner data — with integrity hashing from the first byte." },
  { verb: "Hypothesize", body: "Let models and heuristics propose claims, mapped to MITRE ATT&CK or explicit domain rules." },
  { verb: "Verify", body: "Every claim must cite a traceable artifact. No evidence, no finding." },
  { verb: "Correct", body: "Critic passes demote weak claims, normalise clock drift, and send the loop around again." },
  { verb: "Report", body: "Ship audit-ready output: dashboards, reports and provenance a judge can trust at a glance." },
] as const;

export type RecordEntry = { period: string; title: string; org: string; detail: string };

export const record: RecordEntry[] = [
  {
    period: "2024 — 2028",
    title: "B.E. Electrical & Electronics Engineering",
    org: "Ramaiah Institute of Technology, Bengaluru",
    detail:
      "CGPA 8.45 / 10. Building intelligent systems at the intersection of software engineering, AI/ML and digital forensics alongside the core curriculum.",
  },
  {
    period: "2024",
    title: "PCMC — Pre-University",
    org: "Sri Siddaganga PU College, Davanagere",
    detail: "561 / 600 · 93.50%. Physics, Chemistry, Mathematics & Computer Science.",
  },
  {
    period: "2022",
    title: "SSLC",
    org: "National English Medium High School, Koppal",
    detail: "609 / 625 · 97.44%.",
  },
];

export const certifications = [
  { title: "Google IT Support Professional Certificate", issuer: "Google · Coursera" },
  { title: "Python Essentials 1", issuer: "Cisco · OpenEDG" },
  { title: "Fundamentals of Digital Design for VLSI Chip Design", issuer: "L&T EduTech · Coursera" },
] as const;

/** Skill graph — domains colour the nodes, project stacks draw the edges. */
export type SkillDomain = "AI / ML" | "Software" | "Security" | "Data" | "Infra";

export const skills: { name: string; domain: SkillDomain; aliases?: string[] }[] = [
  { name: "Python", domain: "AI / ML" },
  { name: "scikit-learn", domain: "AI / ML" },
  { name: "XGBoost", domain: "AI / ML" },
  { name: "SHAP", domain: "AI / ML" },
  { name: "LLM Integration", domain: "AI / ML" },
  { name: "NLP Workflows", domain: "AI / ML" },
  { name: "MCP", domain: "AI / ML" },
  { name: "GraphRAG", domain: "AI / ML" },
  { name: "SM-2", domain: "AI / ML" },
  { name: "React", domain: "Software", aliases: ["React Router"] },
  { name: "Next.js", domain: "Software", aliases: ["Next.js 14"] },
  { name: "TypeScript", domain: "Software" },
  { name: "JavaScript", domain: "Software", aliases: ["Web Speech API", "HTML5", "CSS3"] },
  { name: "Vite", domain: "Software", aliases: ["PWA · Workbox", "Vitest"] },
  { name: "Tailwind CSS", domain: "Software" },
  { name: "FastAPI", domain: "Software" },
  { name: "Data viz", domain: "Software", aliases: ["Recharts", "Chart.js", "MapLibre", "Cytoscape"] },
  { name: "Realtime", domain: "Software", aliases: ["WebSockets", "SSE"] },
  { name: "MITRE ATT&CK", domain: "Security" },
  { name: "DFIR", domain: "Security", aliases: ["EVTX"] },
  { name: "Solidity", domain: "Security", aliases: ["ethers.js"] },
  { name: "Auth · JWT", domain: "Security", aliases: ["JWT"] },
  { name: "SQLite", domain: "Data" },
  { name: "PostgreSQL", domain: "Data" },
  { name: "AWS DynamoDB", domain: "Data" },
  { name: "Local-first", domain: "Data", aliases: ["LocalStorage"] },
  { name: "Docker", domain: "Infra" },
  { name: "Vercel", domain: "Infra" },
  { name: "Zoho Catalyst", domain: "Infra" },
];

export const sections = [
  { id: "top", index: "00", label: "Case file" },
  { id: "subject", index: "01", label: "Subject" },
  { id: "method", index: "02", label: "Method" },
  { id: "evidence", index: "03", label: "Evidence" },
  { id: "toolkit", index: "04", label: "Toolkit" },
  { id: "record", index: "05", label: "Record" },
  { id: "contact", index: "06", label: "Open a case" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
