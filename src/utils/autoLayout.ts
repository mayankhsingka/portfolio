import { ArchNode } from "@/data/types";

/**
 * Orbital / golden-ratio layout for canvas nodes.
 *
 * Earlier this file keyed positions by index in the visible-nodes array,
 * which meant unlocking ROOT (and adding `reading_list` to the set) caused
 * every other node to shift to a new orbit. We now key by `node.id` so each
 * node has a stable slot regardless of which other nodes are currently
 * visible.
 */

const CENTER_X = 150; // vw
const CENTER_Y = 150; // vh

// Stable per-id slot assignment. Every node gets the same orbit no matter
// who else is on the canvas. Add new ids here as they're introduced.
const SLOT_BY_ID: Record<string, number> = {
  exp_1: 0,
  exp_2: 1,
  skill_matrix: 2,
  reading_list: 3,
};

// Fallback hash for ids not in the table — keeps assignment deterministic.
function hashSlot(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function applyAutoLayout(nodes: ArchNode[]): ArchNode[] {
  const layoutNodes = nodes.map((n) => ({ ...n }));

  // Core stays at center.
  const coreNode = layoutNodes.find((n) => n.id === "core");
  if (coreNode) {
    if (!coreNode.top) coreNode.top = `calc(${CENTER_Y}vh - 60px)`;
    if (!coreNode.left) coreNode.left = `calc(${CENTER_X}vw - 125px)`;
  }

  const autoNodes = layoutNodes.filter(
    (n) => n.id !== "core" && (!n.top || !n.left),
  );

  // Spiral parameters tuned so the default 250-px node (and the 400-px
  // expanded variant) clears its neighbours on a typical 1280-px viewport.
  const goldenAngle = 137.508 * (Math.PI / 180);
  const baseRadius = 36; // was 30 — push the inner ring outward
  const stepRadius = 11; // was 8 — extra breathing room between orbits

  for (const node of autoNodes) {
    const slot = SLOT_BY_ID[node.id] ?? hashSlot(node.id) % 32;
    const angle = slot * goldenAngle;
    const radius = baseRadius + slot * stepRadius;

    const offsetX = Math.cos(angle) * radius;
    // Compress Y slightly — viewport height < width in vh/vw pixel terms.
    const offsetY = Math.sin(angle) * radius * 0.7;

    node.top = `calc(${CENTER_Y + offsetY}vh - 60px)`;
    node.left = `calc(${CENTER_X + offsetX}vw - 125px)`;
  }

  return layoutNodes;
}
