import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface VFXHandle {
  spawnMatch: (x: number, y: number, color: string) => void;
  spawnExplosion: (x: number, y: number, isSupernova: boolean, color: string) => void;
  spawnDoubleExplosion: (x: number, y: number, color: string) => void;
  spawnScore: (x: number, y: number, text: string, color?: string, isBig?: boolean) => void;
  spawnLineBlast: (x: number, y: number, isHorizontal: boolean, width: number, height: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'circle' | 'shard' | 'star' | 'cyber_rect';
  gravity?: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  lineWidth: number;
  alpha: number;
  decay: number;
  isChromatic?: boolean;
}

interface FloatingLabel {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
  decay: number;
  isBig: boolean;
}

interface LineBeam {
  x: number;
  y: number;
  isHorizontal: boolean;
  progress: number;
  length: number;
  alpha: number;
}

interface VFXCanvasProps {
  width: number;
  height: number;
}

export const VFXCanvas = forwardRef<VFXHandle, VFXCanvasProps>(({ width, height }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const labelsRef = useRef<FloatingLabel[]>([]);
  const lineBeamsRef = useRef<LineBeam[]>([]);

  useImperativeHandle(ref, () => ({
    // Fast cyberpunk spark burst for standard matches
    spawnMatch(x: number, y: number, color: string) {
      const pCount = 14;
      for (let i = 0; i < pCount; i++) {
        const angle = (Math.PI * 2 * i) / pCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 5.2 + 2.8;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4.5 + 2.5,
          color: Math.random() > 0.35 ? color : '#00FF66',
          alpha: 1,
          decay: Math.random() * 0.045 + 0.035,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.35,
          shape: Math.random() > 0.4 ? 'cyber_rect' : 'star',
          gravity: 0.05,
        });
      }
    },

    // Explosive detonation for 4-Match Rectangular Prize, 5-Match Mega Gem, and 6-Match Supernova
    spawnExplosion(x: number, y: number, isSupernova: boolean, color: string) {
      shockwavesRef.current.push({
        x,
        y,
        radius: 10,
        maxRadius: isSupernova ? 220 : 145,
        speed: isSupernova ? 13.0 : 9.5,
        color: isSupernova ? '#00FF66' : color,
        lineWidth: isSupernova ? 8 : 5,
        alpha: 1.0,
        decay: isSupernova ? 0.03 : 0.04,
        isChromatic: isSupernova,
      });

      if (isSupernova) {
        setTimeout(() => {
          shockwavesRef.current.push({
            x,
            y,
            radius: 15,
            maxRadius: 260,
            speed: 14.5,
            color: '#A3E635',
            lineWidth: 6,
            alpha: 0.95,
            decay: 0.028,
            isChromatic: true,
          });
        }, 45);
      }

      const count = isSupernova ? 65 : 38;
      const cyberColors = ['#00FF66', '#A3E635', '#10B981', '#00F0FF', '#FFFFFF'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isSupernova ? 12.5 : 8.5) + 3.0;
        const pColor = isSupernova ? cyberColors[Math.floor(Math.random() * cyberColors.length)] : color;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (isSupernova ? 7 : 5) + 3,
          color: pColor,
          alpha: 1,
          decay: Math.random() * 0.032 + 0.022,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.45,
          shape: Math.random() > 0.4 ? 'star' : 'cyber_rect',
          gravity: 0.06,
        });
      }
    },

    // Mega 5x5 Double Pulse Wave
    spawnDoubleExplosion(x: number, y: number, color: string) {
      shockwavesRef.current.push({
        x,
        y,
        radius: 12,
        maxRadius: 150,
        speed: 10.5,
        color: '#00FF66',
        lineWidth: 6,
        alpha: 1.0,
        decay: 0.04,
      });

      setTimeout(() => {
        shockwavesRef.current.push({
          x,
          y,
          radius: 16,
          maxRadius: 210,
          speed: 12.5,
          color: '#A3E635',
          lineWidth: 7,
          alpha: 1.0,
          decay: 0.03,
          isChromatic: true,
        });
      }, 60);

      for (let i = 0; i < 48; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10.0 + 3.0;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 3,
          color: Math.random() > 0.4 ? '#00FF66' : color,
          alpha: 1,
          decay: 0.03,
          rotation: Math.random() * Math.PI,
          vRot: 0.3,
          shape: 'cyber_rect',
          gravity: 0.05,
        });
      }
    },

    // Floating Cyberpunk Score Popup
    spawnScore(x: number, y: number, text: string, color: string = '#00FF66', isBig: boolean = false) {
      labelsRef.current.push({
        x,
        y: y - 10,
        text,
        color,
        alpha: 1.0,
        scale: isBig ? 1.45 : 1.12,
        vy: isBig ? -2.8 : -2.2,
        decay: isBig ? 0.022 : 0.03,
        isBig,
      });
    },

    // Rectangular Line-Blaster Laser Beam across entire row or column
    spawnLineBlast(x: number, y: number, isHorizontal: boolean, boardWidth: number, boardHeight: number) {
      lineBeamsRef.current.push({
        x,
        y,
        isHorizontal,
        progress: 0,
        length: isHorizontal ? boardWidth * 2 : boardHeight * 2,
        alpha: 1.0,
      });
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const s = shockwavesRef.current[i];
        s.radius += s.speed;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);

        if (s.isChromatic) {
          const grad = ctx.createRadialGradient(s.x, s.y, Math.max(0, s.radius - 12), s.x, s.y, s.radius + 12);
          grad.addColorStop(0, `rgba(0, 255, 102, 0)`);
          grad.addColorStop(0.4, `rgba(236, 253, 245, ${s.alpha})`);
          grad.addColorStop(0.7, `rgba(0, 255, 102, ${s.alpha * 0.95})`);
          grad.addColorStop(1, `rgba(163, 230, 53, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.lineWidth * (1 + (1 - s.alpha) * 0.5);
          ctx.shadowColor = '#00FF66';
          ctx.shadowBlur = 18;
        } else {
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.lineWidth = s.lineWidth * s.alpha;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 14;
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Rectangular Line-Blaster Laser Beams
      for (let i = lineBeamsRef.current.length - 1; i >= 0; i--) {
        const beam = lineBeamsRef.current[i];
        beam.progress += 0.14;
        beam.alpha -= 0.055;

        if (beam.alpha <= 0) {
          lineBeamsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, beam.alpha);
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 22;

        if (beam.isHorizontal) {
          const reach = Math.min(width * 2, beam.progress * beam.length);
          ctx.fillStyle = 'rgba(0, 255, 102, 0.35)';
          ctx.fillRect(beam.x - reach / 2, beam.y - 16, reach, 32);
          ctx.fillStyle = '#A3E635';
          ctx.fillRect(beam.x - reach / 2, beam.y - 6, reach, 12);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(beam.x - reach / 2, beam.y - 2, reach, 4);
        } else {
          const reach = Math.min(height * 2, beam.progress * beam.length);
          ctx.fillStyle = 'rgba(0, 255, 102, 0.35)';
          ctx.fillRect(beam.x - 16, beam.y - reach / 2, 32, reach);
          ctx.fillStyle = '#A3E635';
          ctx.fillRect(beam.x - 6, beam.y - reach / 2, 12, reach);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(beam.x - 2, beam.y - reach / 2, 4, reach);
        }
        ctx.restore();
      }

      // 3. Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'cyber_rect') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#00FF66';
          ctx.shadowBlur = 8;
          ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
          ctx.strokeStyle = '#ECFDF5';
          ctx.lineWidth = 1;
          ctx.strokeRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
        } else if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.6);
          ctx.lineTo(p.size * 0.45, 0);
          ctx.lineTo(0, p.size * 1.6);
          ctx.lineTo(-p.size * 0.45, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 4. Draw Floating Cyberpunk Score Labels
      for (let i = labelsRef.current.length - 1; i >= 0; i--) {
        const lbl = labelsRef.current[i];
        lbl.y += lbl.vy;
        lbl.alpha -= lbl.decay;
        if (lbl.isBig && lbl.scale > 1.0) {
          lbl.scale -= 0.02;
        }

        if (lbl.alpha <= 0) {
          labelsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, lbl.alpha);
        const fontSize = Math.round((lbl.isBig ? 24 : 18) * lbl.scale);
        ctx.font = `900 ${fontSize}px 'JetBrains Mono', 'Outfit', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = 'rgba(0, 255, 102, 0.7)';
        ctx.shadowBlur = 10;

        ctx.lineWidth = lbl.isBig ? 5 : 4;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#020805';
        ctx.strokeText(lbl.text, lbl.x, lbl.y);

        ctx.fillStyle = lbl.color || '#00FF66';
        ctx.fillText(lbl.text, lbl.x, lbl.y);

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-30"
      style={{ width, height }}
    />
  );
});

VFXCanvas.displayName = 'VFXCanvas';
