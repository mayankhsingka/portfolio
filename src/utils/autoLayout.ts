import { ArchNode } from "@/data/types";

/**
 * Applies an Orbital / Golden Ratio layout to nodes that don't have explicit top/left coordinates.
 * This guarantees the nodes form a beautiful, organic, non-overlapping blueprint around the core.
 */
export function applyAutoLayout(nodes: ArchNode[]): ArchNode[] {
  const CENTER_X = 150; // vw
  const CENTER_Y = 150; // vh
  
  // Clone nodes to avoid mutating the original array directly if not intended
  const layoutNodes = [...nodes].map(n => ({ ...n }));
  
  const coreNode = layoutNodes.find(n => n.id === "core");
  if (coreNode) {
    if (!coreNode.top) coreNode.top = `calc(${CENTER_Y}vh - 60px)`;
    if (!coreNode.left) coreNode.left = `calc(${CENTER_X}vw - 125px)`;
  }
  
  const autoNodes = layoutNodes.filter(n => n.id !== "core" && (!n.top || !n.left));
  
  // Golden angle in radians
  const goldenAngle = 137.508 * (Math.PI / 180);
  
  autoNodes.forEach((node, idx) => {
    // The angle increases by the golden angle each step
    const angle = idx * goldenAngle;
    
    // Radius grows outwards. 
    // Base radius: 30vw/vh. Grows by 8vw/vh per node.
    const radius = 30 + (idx * 8);
    
    // Calculate offsets (polar to Cartesian)
    const offsetX = Math.cos(angle) * radius;
    // Compress Y slightly because screen vh is usually taller than vw relative to pixels
    const offsetY = Math.sin(angle) * radius * 0.7; 
    
    node.top = `calc(${CENTER_Y + offsetY}vh - 60px)`;
    node.left = `calc(${CENTER_X + offsetX}vw - 125px)`;
  });
  
  return layoutNodes;
}
