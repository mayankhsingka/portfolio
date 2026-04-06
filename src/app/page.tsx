import { SystemGrid } from "@/components/SystemGrid";
import { ArchitectureNode } from "@/components/ArchitectureNode";
import { TerminalLogs } from "@/components/TerminalLogs";
import { CommandPalette } from "@/components/CommandPalette";
import { PORTFOLIO_DATA } from "@/data/portfolio";

function BlueprintLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      {/* Node 1 to Node 2 */}
      <path 
        d="M 50vw 50vh L 20vw 20vh" 
        stroke="black" 
        strokeWidth="2" 
        strokeDasharray="4 4" 
        fill="none" 
      />
      {/* Node 1 to Node 3 */}
      <path 
        d="M 50vw 50vh L 30vw 80vh" 
        stroke="black" 
        strokeWidth="2" 
        fill="none" 
      />
      {/* Node 1 to Node 4 */}
      <path 
        d="M 50vw 50vh L 80vw 30vh" 
        stroke="black" 
        strokeWidth="2" 
        fill="none" 
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="w-full h-full text-black">
      <SystemGrid>
        <BlueprintLines />
        
        {PORTFOLIO_DATA.nodes.map((node) => (
          <ArchitectureNode
            key={node.id}
            id={node.id}
            title={node.title}
            status={node.status as any}
            description={node.description}
            metrics={node.metrics}
            top={node.top}
            left={node.left}
          />
        ))}
      </SystemGrid>

      <TerminalLogs />
      <CommandPalette />
      
      <div className="fixed top-4 left-4 font-mono text-xs font-bold pointer-events-none uppercase">
        <span className="block border-b-2 border-black pb-1 mb-1">{PORTFOLIO_DATA.general.name} - System Blueprint v1.0</span>
        [Press Ctrl+K for command access]<br />
        [Drag grid to navigate nodes]
      </div>
    </main>
  );
}
