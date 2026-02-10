import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter',
});

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      containerRef.current.innerHTML = `<div class="mermaid" id="${id}">${chart}</div>`;
      
      try {
        mermaid.run({
            nodes: [containerRef.current.querySelector(`#${id}`) as HTMLElement]
        });
      } catch (e) {
        console.error('Mermaid rendering failed', e);
        containerRef.current.innerHTML = '<p class="text-red-400 text-xs">Diagram unavailable</p>';
      }
    }
  }, [chart]);

  return <div ref={containerRef} className="my-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto flex justify-center" />;
};

export default MermaidDiagram;