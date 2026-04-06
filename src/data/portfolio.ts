export const PORTFOLIO_DATA = {
  general: {
    name: "Mayank Himmatsingka",
    role: "Product Builder & System Architect",
    age: "20",
    philosophy: "I build innovative products and ship websites real quick. No generic fluff, just scalable systems.",
    contactEmail: "mayankhsingka@gmail.com",
    githubUrl: "https://github.com/mankuu-10",
    linkedinUrl: "https://linkedin.com/in/mayankhsingka",
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
      status: "ACTIVE",
      description: "A secure digital space offering students a safe platform to heal, express, and connect with counselors.",
      top: "calc(20vh - 60px)",
      left: "calc(20vw - 125px)",
      metrics: [
        { label: "Type", value: "Wellness Platform" },
        { label: "Focus", value: "Student Counseling" },
      ]
    },
    {
      id: "exp_2",
      title: "Producive",
      status: "SCALING",
      description: "Deep-focus browser extension. Comprehensive YouTube control, site blocking, and stopwatch overlays.",
      top: "calc(80vh - 60px)",
      left: "calc(30vw - 125px)",
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
    { path: "/core-identity", description: "Read core system specifications [About](Shortcut: Shift+A)" },
    { path: "/ping", description: "Establish secure connection [Contact](Shortcut: Shift+C)" },
    { path: "/shipped", description: "View recent architecture deployments [Projects]" },
    { path: "/internal-memos", description: "Read operational logs and system transmissions [Blog]" }
  ]
};
