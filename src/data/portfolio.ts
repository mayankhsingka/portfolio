export const PORTFOLIO_DATA = {
  general: {
    name: "[Your Name]",
    role: "System Architect & Operations Engineer",
    contactEmail: "root@yourdomain.com",
    githubUrl: "https://github.com/yourusername",
    linkedinUrl: "https://linkedin.com/in/yourusername",
  },

  nodes: [
    {
      id: "core",
      title: "Root Directive",
      status: "ACTIVE",
      description: "I build systems that scale. From digital architecture to operational leverage.",
      top: "calc(50vh - 60px)",
      left: "calc(50vw - 125px)",
      metrics: [
        { label: "Role", value: "System Architect" },
        { label: "Focus", value: "Scale & Operations" },
      ]
    },
    {
      id: "exp_1",
      title: "[Company/Project Alpha]",
      status: "SCALING",
      description: "Architected high-availability infrastructure mapping real-world physical ops to digital pipelines.",
      top: "calc(20vh - 60px)",
      left: "calc(20vw - 125px)",
      metrics: [
        { label: "Throughput", value: "10k req/s" },
        { label: "Uptime", value: "99.999%" },
      ]
    },
    {
      id: "exp_2",
      title: "[System Beta]",
      status: "ARCHIVED",
      description: "Automated core fulfillment logic across 3 warehouses, reducing manual dependency.",
      top: "calc(80vh - 60px)",
      left: "calc(30vw - 125px)",
      metrics: [
        { label: "Automation", value: "94%" },
        { label: "Man-hours saved", value: "400/mo" },
      ]
    },
    {
      id: "skill_matrix",
      title: "Skill Matrix",
      status: "ACTIVE",
      description: "Core technical implementations and architectural frameworks.",
      top: "calc(30vh - 60px)",
      left: "calc(80vw - 125px)",
      metrics: [
        { label: "Frontend", value: "Next.js, React" },
        { label: "Backend", value: "Node, Go, PostgreSQL" },
        { label: "Infrastructure", value: "AWS, Docker" },
      ]
    }
  ],

  logs: [
    { text: "[SYS_BOOT] Initializing core architecture for [Your Name]...", type: "info" },
    { text: "[WARN] Scaling requirements detected: HIGH", type: "warn" },
    { text: "[OK] System nodes active. Waiting for root command...", type: "ok" },
    { text: "[METRIC] Throughput increased by 200%", type: "info", delay: 2000 },
    { text: "[SYS_EVENT] Deployed highly concurrent e-commerce platform", type: "info", delay: 4000 },
    { text: "[INFO] Refactoring monolith to microservices...", type: "info", delay: 6000 },
    { text: "[OK] Operational leverage optimized.", type: "ok", delay: 8000 },
    { text: "[METRIC] Latency reduced to < 50ms", type: "info", delay: 10000 },
  ],
  
  commands: [
    { path: "/about-me", description: "Read core system specifications [About]" },
    { path: "/contact", description: "Establish secure connection [Contact]" },
    { path: "/projects/latest", description: "View recent architecture implementations" }
  ]
};
