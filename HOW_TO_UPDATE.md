# System Maintenance & Content Updates

This portfolio is strictly data-driven. The UI components are decoupled from the content. You **never** need to modify `.tsx` files to add new projects, blogs, or work experiences.

All content is hydrated from a single source of truth: `src/data/portfolio.ts` (for projects/experiences) and `src/data/memos.ts` (for blogs).

---

## 1. Adding a New Project or Experience

Open `src/data/portfolio.ts` and locate the `nodes` array. Each object in this array represents a node on your infinite grid.

### The Template
Copy and paste this template into the `nodes` array.

```typescript
{
  // "project" generates a full case study page. 
  // "info" just shows the card on the grid (good for basic about info or lists).
  kind: "project", 
  
  id: "exp_google", // Unique internal ID
  title: "Software Engineer @ Google",
  slug: "swe-google", // IMPORTANT: This creates the URL -> /shipped/swe-google
  status: "ACTIVE", // E.g., ACTIVE, ARCHIVED, SCALING
  
  // The summary shown on the grid card
  description: "Re-engineered the core distributed caching layer for search indexing.",
  
  // Absolute positioning on the infinite canvas. 
  // Adjust these to place it relative to your other nodes.
  top: "calc(150vh - 60px)",
  left: "calc(80vw - 125px)",
  
  // URLs for the [SOURCE_CODE] and [LIVE_DEPLOYMENT] buttons
  sourceUrl: "https://github.com/mankuu-10/project", 
  liveUrl: "https://project.com", 
  
  // ---- CASE FILE DETAILS (Only needed if kind: "project") ----
  fileId: "CASE_003",
  created: "2024-05-01",
  modified: "2025-08-01",
  revision: 3,
  telemetry: "COMMITS: 432 | DEPLOYMENTS: 12",
  problem: "The legacy caching layer was dropping 5% of concurrent requests...",
  impact: "Resolved the bottleneck entirely. Handled 5M+ QPS.",
  
  // Metrics displayed on the grid node
  metrics: [
    { label: "Role", value: "Backend L3" },
    { label: "Duration", value: "1.5 Yrs" },
  ],
  
  // Tech Stack breakdown for the case file page
  techStack: [
    { label: "SYS", value: "C++", reason: "Required for memory management." },
    { label: "DB", value: "Spanner", reason: "Distributed consistency." },
  ],
  
  // Optional: Visual Evidence (Images)
  // Ensure images are placed in the /public/media directory
  gallery: [
    { type: "image", url: "/media/google/dashboard.png", caption: "Internal telemetry dashboard." }
  ]
}
```

### Linking the Node (The SVG Wires)
If you want to draw a connecting wire from the "Root Directive" (or any other node) to your new experience:
1. Open `src/components/DataFlowLines.tsx`.
2. Locate the `CONNECTIONS` array at the top.
3. Add your connection: `{ from: "core", to: "exp_google" }`.

---

## 2. Adding a New Blog / Memo

Open `src/data/memos.ts` and locate the `MEMOS` array.

### The Template
Copy and paste this template into the `MEMOS` array.

```typescript
{
  slug: "scaling-websocket-infrastructure", // URL: /internal-memos/scaling-websocket-infrastructure
  title: "Scaling WebSocket Infrastructure to 10k Connections",
  date: "2026-05-14",
  classification: "UNCLASSIFIED", // E.g., UNCLASSIFIED, CONFIDENTIAL, RESTRICTED
  summary: "A post-mortem on how we handled connection exhaustion during peak load.",
  
  // The content of the blog post. 
  // Each string in this array represents a paragraph.
  content: [
    "When we first deployed Manasya, the real-time layer was built on a naive polling mechanism. This was fine for 100 users, but at scale, it melted our servers.",
    
    // You can use these special prefixes to style paragraphs differently:
    "> SYSTEM_NOTE: Always measure before optimizing.",
    
    // Normal paragraphs
    "We switched to Supabase Realtime channels. The migration involved...",
    
    // Terminal style code blocks
    "`[CODE_BLOCK] const channel = supabase.channel('room_1'); channel.subscribe();`"
  ],
  
  tags: ["infrastructure", "websockets", "scaling"]
}
```

---

## 3. Updating Terminal Logs and Commands

All the fake terminal logs that scroll on the screen, and the simulated file system, are also in `src/data/portfolio.ts`.

- **To update the boot logs:** Edit the `logs` array.
- **To update the simulated file system (`ls` and `cat` commands):** Edit the `fileSystem` object.

Save the file, and Next.js will instantly hydrate the new content across the entire application.
