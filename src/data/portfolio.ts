import type { PortfolioData } from "./types";

export const PORTFOLIO_DATA: PortfolioData = {
  general: {
    name: "Mayank Himmatsingka",
    role: "Product Builder & System Architect",
    age: "20",
    philosophy: "Architecting systems that survive the chaos of scale. I build high-performance products with extreme velocity, stripping away abstraction until only the raw utility remains.",
    contactEmail: "mayankhsingka@gmail.com",
    phone: "7326037045",
    githubUrl: "https://github.com/mankuu-10",
    linkedinUrl: "https://linkedin.com/in/mayankhsingka",
    launchDate: "2026-04-01",
    builderArchiveUrl: "/resume.pdf",
  },

  fileSystem: {
    "readme.md": "SYSTEM DIRECTIVE v1.0\n------------------\nThis environment is a raw representation of my workflow. No bloated UI, just the architecture.\nFeel free to explore the network nodes. Some sectors might require higher clearance.",
    "philosophy.txt": ">> ARCHITECTURAL PHILOSOPHY:\n\n1. Speed over perfection. A shipped product is infinitely more valuable than a perfect local branch.\n2. Brutal utility. Design should serve the function, not obscure it.\n3. Scalability from day zero. Systems must be built to handle load without faltering.",
    "sys_metrics.log": "[08:45:01] CPU_USAGE: 12% | MEM: 4021MB / 8192MB\n[08:45:05] ACTIVE_CONNECTIONS: 1\n[08:45:12] STATUS: NOMINAL. Waiting for operator input...",
    ".classified": "[ACCESS_DENIED] Insufficient clearance. Promote to OPERATOR to read this file.",
    "reading_list.dat": "[OPERATOR_ONLY] Current reading queue:\n1. Zero to One — Peter Thiel\n2. The Mom Test — Rob Fitzpatrick\n3. Hooked — Nir Eyal\n4. Inspired — Marty Cagan\n5. The Hard Thing About Hard Things — Ben Horowitz",
    "sys_breach.log": "[CORRUPTED] ... \nError: System vulnerable. \nAn operator could type 'breach' to disrupt architecture.\n[CLASSIFIED] Surveillance offline: /engage_surveillance \n[WARNING] Network unstable. Prepare for /play offline mode.",
  },

  nodes: [
    {
      kind: "info",
      id: "core",
      title: "Root Directive",
      status: "ACTIVE",
      description: "Root operator at 20. Architecting resilient systems and shipping high-impact products with absolute precision.",
      top: "calc(150vh - 60px)",
      left: "calc(150vw - 125px)",
      metrics: [
        { label: "Role", value: "System Architect" },
        { label: "Focus", value: "Scale & Operations" },
      ]
    },
    {
      kind: "project",
      id: "exp_1",
      title: "Manasya",
      slug: "manasya",
      status: "ACTIVE",
      description: "A zero-trust digital perimeter for emotional resilience. Facilitating secure, encrypted uplinks between students and counseling safety nets.",
      top: "calc(120vh - 60px)",
      left: "calc(120vw - 125px)",
      sourceUrl: "https://github.com/mayankhsingka/manasya",
      liveUrl: "https://manasya.in",
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
        { label: "Counselors", value: "20" },
        { label: "Students", value: "50" },
      ],
      gallery: [
        { type: "image", url: "/media/manasya/dashboard.svg", caption: "SYS_VIEW: Counselor orchestration dashboard." },
        { type: "image", url: "/media/manasya/chat.svg", caption: "SECURE_COMM: End-to-end encrypted student interface." },
      ]
    },
    {
      kind: "project",
      id: "exp_2",
      title: "Producive",
      slug: "producive",
      status: "SCALING",
      description: "A tactical firewall for the human mind. Neutralizing algorithmic rabbit holes and re-engineering the DOM to protect cognitive focus.",
      top: "calc(180vh - 60px)",
      left: "calc(130vw - 125px)",
      sourceUrl: "https://github.com/mayankhsingka/producive",
      liveUrl: "https://chromewebstore.google.com/detail/producive",
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
        { label: "Status", value: "Manifest V3 Compliant" },
      ],
      gallery: [
        { type: "image", url: "/media/producive/yt_controls.svg", caption: "DOM_MOD: Granular YouTube interface manipulation." },
        { type: "image", url: "/media/producive/focus_timer.svg", caption: "UI_OVERLAY: Persistent stopwatch tracking." },
      ]
    },
    {
      kind: "info",
      id: "skill_matrix",
      title: "Core Stack",
      status: "ACTIVE",
      description: "Web development and system architecture tools used for rapid shipping.",
      top: "calc(130vh - 60px)",
      left: "calc(180vw - 125px)",
      metrics: [
        { label: "Frontend", value: "Next.js, Tailwind" },
        { label: "Execution", value: "Rapid Iteration" },
      ]
    },
    {
      kind: "info",
      id: "reading_list",
      title: "Reading Queue",
      status: "CLASSIFIED",
      description: "Curated reading list for product thinking, execution frameworks, and system design.",
      top: "calc(170vh - 60px)",
      left: "calc(175vw - 125px)",
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
    { text: "[HINT] Establish a directive. Press Ctrl+K or type '/' to open Command Palette.", type: "warn", delay: 1500 },
    { text: "[METRIC] Project 'Manasya' deployed to production environment.", type: "info", delay: 3000 },
    { text: "[SYS_EVENT] Establishing secure counseling connections...", type: "info", delay: 5000 },
    { text: "[METRIC] Extension 'Producive' blocking known distractions.", type: "warn", delay: 7000 },
    { text: "[OK] YouTube controls and focus stopwatch initialized.", type: "ok", delay: 9000 },
    { text: "[INFO] Building next innovative product...", type: "info", delay: 11000 },
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
