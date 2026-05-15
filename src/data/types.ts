// ─── Portfolio Type System ───────────────────────────────────────────
// Discriminated union of all node types on the architecture canvas.

export interface BaseNode {
  id: string;
  title: string;
  status: "ACTIVE" | "SCALING" | "CLASSIFIED" | "LOCKED";
  description: string;
  top?: string;
  left?: string;
  metrics: { label: string; value: string }[];
  clearance?: "OPERATOR" | "ROOT";
}

export interface NodeConnection {
  from: string;
  to: string;
}

export interface ProjectNode extends BaseNode {
  kind: "project";
  slug: string;
  sourceUrl: string;
  liveUrl: string;
  fileId: string;
  created: string;
  modified: string;
  revision: number;
  telemetry: string;
  problem: string;
  architectureDecisions: string[];
  challenges: { title: string; detail: string }[];
  impact: string;
  techStack: { label: string; value: string; reason?: string }[];
  gallery?: { type: "image" | "video"; url: string; caption?: string }[];
}

export interface InfoNode extends BaseNode {
  kind: "info";
}

export type ArchNode = ProjectNode | InfoNode;

// ─── Helpers ─────────────────────────────────────────────────────────
export function isProjectNode(node: ArchNode): node is ProjectNode {
  return node.kind === "project";
}

export interface LogEntry {
  text: string;
  type: "info" | "ok" | "warn" | "error";
  delay?: number;
}

export interface CommandDef {
  path: string;
  description: string;
}

export interface GeneralInfo {
  name: string;
  role: string;
  age: string;
  philosophy: string;
  contactEmail: string;
  phone?: string;
  githubUrl: string;
  linkedinUrl: string;
  launchDate: string;
  builderArchiveUrl: string;
}

export interface PortfolioData {
  general: GeneralInfo;
  fileSystem: Record<string, string>;
  nodes: ArchNode[];
  connections: NodeConnection[];
  logs: LogEntry[];
  commands: CommandDef[];
}
