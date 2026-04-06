export interface Memo {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string[]; // Simple array of paragraphs for a brutalist rendering approach
}

export const MEMOS_DATA: Memo[] = [
  {
    slug: "building-manasya-safe-space",
    title: "Building Manasya: A Digital Safe Space",
    date: "2026-04-01",
    tags: ["PRODUCT", "WELLNESS", "ARCHITECTURE"],
    excerpt: "Why I built a platform for students to heal and express themselves.",
    content: [
      "[INITIALIZATION_LOG]: The mental health crisis among students is an operational bottleneck on human potential. I noticed a gap where students lacked a truly secure, anonymous, and un-judged digital area to process their emotions.",
      "Manasya was built exactly for this metric: lowering the friction to counseling and self-expression.",
      "The underlying architecture prioritizes complete data security while maintaining a highly accessible UX. By connecting counselors directly into the loop, we created a closed-system safety net.",
      "Shipping this fast meant relying on rapid iteration frameworks, cutting out bloated feature specs, and focusing purely on the core directive: A safe space to heal."
    ]
  },
  {
    slug: "producive-extension-depth",
    title: "Producive: Engineering Deep Focus",
    date: "2026-03-15",
    tags: ["PRODUCTIVITY", "EXTENSION", "SYSTEMS"],
    excerpt: "Taking control back from the YouTube algorithm through hard site constraints.",
    content: [
      "[SYSTEM_ANALYSIS]: The modern web is hostile to deep work. It is engineered to hijack attention spans. Producive is my architectural response to that problem.",
      "Instead of a generic site blocker, I engineered in-depth productivity toolkits. It intercepts YouTube's API flows directly, allowing you to utilize it for learning while completely neutralizing its algorithmically designed rabbit holes.",
      "Building a browser extension requires operating within strict sandbox constraints, optimizing the background service workers so the focus stopwatch overlay is hyper-performant and never drags down the host machine's resources.",
      "[SYS_CONCLUSION]: We must build systems to constrain the systems trying to consume us."
    ]
  }
];
