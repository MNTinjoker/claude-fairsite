import React, { useEffect, useState } from 'react';

interface CyberNode {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

/**
 * Cyberpunk Black & Emerald Matrix Background with rich gradients and shades
 */
export const SodaPopBackground: React.FC = () => {
  const [nodes, setNodes] = useState<CyberNode[]>([]);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const list: CyberNode[] = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        left: Math.random() * 96 + 2,
        size: Math.random() * 18 + 8,
        duration: Math.random() * 8 + 7,
        delay: Math.random() * 10,
      });
    }
    setNodes(list);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x: normX * 12, y: normY * 12 });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020805]">
      {/* Rich Black & Green Cyberpunk Radial Gradient & Grid Layer */}
      <div
        className="absolute -inset-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          background:
            'radial-gradient(circle at 50% 15%, #0c2e1f 0%, #061911 40%, #030c08 75%, #010503 100%)',
        }}
      >
        {/* Ambient Neon Green & Cyber Lime Gradient Shades */}
        <div className="absolute top-8 left-1/4 w-[34rem] h-[34rem] rounded-full bg-[#00ff66]/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full bg-[#10b981]/12 blur-[110px]" />
        <div className="absolute bottom-8 left-10 w-[26rem] h-[26rem] rounded-full bg-[#a3e635]/8 blur-[100px]" />

        {/* Subtle Cyberpunk Perspective Grid */}
        <div
          className="w-full h-full opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 255, 102, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 102, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Floating Cyber Matrix Data Nodes */}
      {nodes.map((b) => (
        <div
          key={b.id}
          className="soda-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '4px',
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
