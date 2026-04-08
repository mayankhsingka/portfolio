export const PORTFOLIO_DATA = {
  general: {
    name: "Mayank Himmatsingka",
    role: "Product Builder & System Architect",
    age: "20",
    philosophy: "I build innovative products and ship websites real quick. No generic fluff, just scalable systems.",
    contactEmail: "mayankhsingka@gmail.com",
    githubUrl: "https://github.com/mankuu-10",
    linkedinUrl: "https://linkedin.com/in/mayankhsingka",
    launchDate: "2026-04-01",
  },

  fileSystem: {
    "readme.md": "SYSTEM DIRECTIVE v1.0\n------------------\nThis environment is a raw representation of my workflow. No bloated UI, just the architecture.\nFeel free to explore the network nodes. Some sectors might require higher clearance.",
    "philosophy.txt": ">> ARCHITECTURAL PHILOSOPHY:\n\n1. Speed over perfection. A shipped product is infinitely more valuable than a perfect local branch.\n2. Brutal utility. Design should serve the function, not obscure it.\n3. Scalability from day zero. Systems must be built to handle load without faltering.",
    "sys_metrics.log": "[08:45:01] CPU_USAGE: 12% | MEM: 4021MB / 8192MB\n[08:45:05] ACTIVE_CONNECTIONS: 1\n[08:45:12] STATUS: NOMINAL. Waiting for operator input...",
    ".classified": "[ACCESS_DENIED] Insufficient clearance. Promote to OPERATOR to read this file.",
    "reading_list.dat": "[OPERATOR_ONLY] Current reading queue:\n1. Zero to One — Peter Thiel\n2. The Mom Test — Rob Fitzpatrick\n3. Hooked — Nir Eyal\n4. Inspired — Marty Cagan\n5. The Hard Thing About Hard Things — Ben Horowitz",
  },

  nodes: [
    {
      id: "core",
      title: "Root Directive",
      status: "ACTIVE",
      description: "I build systems that solve real problems. 20yo. Shipping innovative products real quick.",
      top: "calc(50vh - 60px)",
      left: "calc(50vw - 125px)",
      metrics: [
        { label: "Role", value: "System Architect" },
        { label: "Focus", value: "Scale & Operations" },
      ]
    },
    {
      id: "exp_1",
      title: "Manasya",
      slug: "manasya",
      status: "ACTIVE",
      description: "A secure digital space offering students a safe platform to heal, express, and connect with counselors.",
      top: "calc(20vh - 60px)",
      left: "calc(20vw - 125px)",
      sourceUrl: "#",
      liveUrl: "#",
      fileId: "CASE_001",
      created: "2026-01-15",
      modified: "2026-04-01",
      revision: 7,
      telemetry: "SESSIONS: 342 active | UPTIME: 45d 12h | CONN: SECURE",
      problem: "The mental health crisis among students is a silent epidemic. Most students lack a truly secure, anonymous, and judgment-free space to process emotions. Existing platforms are either too clinical or too public — neither works when someone is at their most vulnerable.",
      architectureDecisions: [
        "Chose Supabase over Firebase for native Postgres support — needed complex relational queries for counselor-student matching without exposing raw SQL.",
        "Realtime WebSockets for counseling sessions. No polling. Messages arrive in under 100ms.",
        "Row-Level Security policies handle authorization at the database layer. Zero trust in the client.",
        "Edge functions for sensitive operations — OTP verification and session tokens never touch the browser.",
      ],
      challenges: [
        { title: "Anonymous Identity", detail: "Students needed to be anonymous to peers but identifiable to counselors. Built a dual-identity system with encrypted pseudonyms." },
        { title: "Session Security", detail: "Counseling data is sensitive. Implemented end-to-end encrypted message storage with automatic expiry policies." },
        { title: "Real-time at Scale", detail: "Supabase Realtime channels per session. Handled connection pooling to prevent WebSocket exhaustion under load." },
      ],
      impact: "Currently serving students across multiple institutions. Average session response time under 2 minutes. Zero security incidents since launch.",
      techStack: [
        { label: "FWD", value: "Next.js 15", reason: "App Router for server components. Zero client JS for static pages." },
        { label: "STY", value: "Tailwind CSS v4", reason: "Design tokens via CSS variables. Consistent theming across 40+ components." },
        { label: "DB", value: "Supabase", reason: "Postgres + Realtime + Auth in one service. Zero backend code needed." },
        { label: "AUTH", value: "Supabase Auth", reason: "Built-in RLS integration. Role-based access without middleware." },
        { label: "INFRA", value: "Vercel", reason: "Edge-first deployment. Sub-100ms TTFB globally." },
        { label: "RT", value: "Realtime WS", reason: "Native Supabase channels. No third-party WebSocket service." },
      ],
      metrics: [
        { label: "Type", value: "Wellness Platform" },
        { label: "Focus", value: "Student Counseling" },
      ]
    },
    {
      id: "exp_2",
      title: "Producive",
      slug: "producive",
      status: "SCALING",
      description: "Deep-focus browser extension. Comprehensive YouTube control, site blocking, and stopwatch overlays.",
      top: "calc(80vh - 60px)",
      left: "calc(30vw - 125px)",
      sourceUrl: "#",
      liveUrl: "#",
      fileId: "CASE_002",
      created: "2026-03-01",
      modified: "2026-04-05",
      revision: 12,
      telemetry: "FOCUS_HRS: 1,208 blocked | INTERCEPTS: 4,821 | STATUS: SCALING",
      problem: "The modern web is architecturally hostile to deep work. YouTube alone uses thousands of engineering hours to maximize watch time. A simple 'block sites' extension doesn't cut it — you need granular, in-depth control over specific platform behaviors while keeping them usable for legitimate learning.",
      architectureDecisions: [
        "Manifest V3 with persistent service worker — keeps the focus stopwatch accurate even when the popup is closed.",
        "Content scripts inject directly into YouTube's DOM. No iframe wrappers that break on updates.",
        "Chrome Storage API for sync across devices. Settings follow the user, not the machine.",
        "Modular feature flags — each productivity tool (YT control, site blocker, stopwatch) can be independently enabled.",
      ],
      challenges: [
        { title: "YouTube DOM Instability", detail: "YouTube's SPA rewrites the DOM constantly. Built mutation observers that re-inject controls after every navigation without performance degradation." },
        { title: "Stopwatch Persistence", detail: "Browser extensions lose state on popup close. Moved timing logic to the service worker with chrome.alarms as a heartbeat fallback." },
        { title: "Performance Budget", detail: "Extensions share the main thread. Kept total injected JS under 15KB gzipped. No frameworks, no dependencies." },
      ],
      impact: "Actively used daily. Over 1,200 documented focus hours. Reduced average YouTube session time from 45 minutes to 12 minutes for test users.",
      techStack: [
        { label: "CORE", value: "Chrome Extensions API", reason: "Manifest V3 for modern extension standards. Service worker architecture." },
        { label: "UI", value: "Vanilla JS + CSS", reason: "Zero dependencies. Total bundle under 15KB. No framework overhead." },
        { label: "STORE", value: "Chrome Storage API", reason: "Sync storage follows user across devices without a backend." },
        { label: "INJECT", value: "Content Scripts", reason: "Direct DOM access to YouTube. No iframe sandboxing limitations." },
        { label: "BG", value: "Service Worker", reason: "Persistent background processing. Stopwatch survives popup close." },
        { label: "TARGET", value: "YouTube DOM API", reason: "Mutation observers for SPA navigation. Re-inject on route changes." },
      ],
      metrics: [
        { label: "Features", value: "YT Control, Focus Clock" },
        { label: "Core", value: "In-depth Productivity" },
      ]
    },
    {
      id: "skill_matrix",
      title: "Core Stack",
      status: "ACTIVE",
      description: "Web development and system architecture tools used for rapid shipping.",
      top: "calc(30vh - 60px)",
      left: "calc(80vw - 125px)",
      metrics: [
        { label: "Frontend", value: "Next.js, Tailwind" },
        { label: "Execution", value: "Rapid Iteration" },
      ]
    },
    {
      id: "reading_list",
      title: "Reading Queue",
      status: "CLASSIFIED",
      description: "Curated reading list for product thinking, execution frameworks, and system design.",
      top: "calc(70vh - 60px)",
      left: "calc(75vw - 125px)",
      clearance: "OPERATOR",
      metrics: [
        { label: "Books", value: "5 Queued" },
        { label: "Focus", value: "Product & Systems" },
      ]
    }
  ],

  logs: [
    { text: "[SYS_BOOT] Mapping identity: Mayank Himmatsingka (Age: 20)...", type: "info" },
    { text: "[OK] Root directives established. Ready to ship.", type: "ok" },
    { text: "[METRIC] Project 'Manasya' deployed to production environment.", type: "info", delay: 2000 },
    { text: "[SYS_EVENT] Establishing secure counseling connections...", type: "info", delay: 4000 },
    { text: "[METRIC] Extension 'Producive' blocking known distractions.", type: "warn", delay: 6000 },
    { text: "[OK] YouTube controls and focus stopwatch initialized.", type: "ok", delay: 8000 },
    { text: "[INFO] Building next innovative product...", type: "info", delay: 10000 },
  ],

  commands: [
    { path: "help", description: "Show all available commands" },
    { path: "ls", description: "List files in current directory" },
    { path: "cat <file>", description: "Read file contents" },
    { path: "whoami", description: "Print current operator identity" },
    { path: "neofetch", description: "Display system information" },
    { path: "clear", description: "Clear terminal output" },
  ]
};
