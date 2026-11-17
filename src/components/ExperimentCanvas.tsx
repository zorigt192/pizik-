import React, { useRef, useEffect, useCallback } from 'react';
import { soundManager } from '../utils/audio';

interface ExperimentCanvasProps {
  showVectors: boolean;
  windGust: boolean;
  onWindEnd?: () => void;
  spinTrigger: number;
  nudgeTrigger: number;
  resetTrigger: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface BokehCircle {
  x: number;
  y: number;
  r: number;
  color: string;
}

const BOKEH_LIGHTS: BokehCircle[] = [
  { x: 110, y: 95, r: 52, color: 'rgba(251, 191, 36, 0.16)' },
  { x: 240, y: 170, r: 34, color: 'rgba(245, 158, 11, 0.12)' },
  { x: 840, y: 110, r: 64, color: 'rgba(253, 224, 71, 0.13)' },
  { x: 760, y: 230, r: 28, color: 'rgba(148, 163, 184, 0.14)' },
  { x: 920, y: 280, r: 46, color: 'rgba(251, 146, 60, 0.12)' },
  { x: 70, y: 270, r: 38, color: 'rgba(226, 232, 240, 0.11)' },
  { x: 420, y: 80, r: 44, color: 'rgba(251, 191, 36, 0.10)' },
  { x: 600, y: 65, r: 30, color: 'rgba(248, 250, 252, 0.09)' },
];

export const ExperimentCanvas: React.FC<ExperimentCanvasProps> = ({
  showVectors,
  windGust,
  onWindEnd,
  spinTrigger,
  nudgeTrigger,
  resetTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const physicsRef = useRef({
    theta: 0.03,        // Subtle initial micro-tilt that settles into equilibrium
    omega: 0,
    alpha: 0,
    spinAngle: 0,
    spinVel: 0,
    damping: 0.986,
    naturalFreqSq: 13.5,
    isDragging: false,
  });

  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (spinTrigger > 0) {
      physicsRef.current.spinVel += 3.4;
      soundManager.playWhoosh(0.45, 520);
    }
  }, [spinTrigger]);

  useEffect(() => {
    if (nudgeTrigger > 0) {
      physicsRef.current.omega += 1.55;
      soundManager.playForkClink();
    }
  }, [nudgeTrigger]);

  useEffect(() => {
    if (resetTrigger > 0) {
      physicsRef.current.theta = 0;
      physicsRef.current.omega = 0;
      physicsRef.current.spinAngle = 0;
      physicsRef.current.spinVel = 0;
      soundManager.playBalanceChime();
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (windGust) {
      soundManager.playWhoosh(0.55, 380);
      physicsRef.current.omega += 1.9;
      physicsRef.current.spinVel += 0.95;
      for (let i = 0; i < 36; i++) {
        particlesRef.current.push({
          x: 40 + Math.random() * 200,
          y: 120 + Math.random() * 280,
          vx: 9 + Math.random() * 8,
          vy: (Math.random() - 0.5) * 2.2,
          size: 2 + Math.random() * 3,
          color: 'rgba(255, 255, 255, 0.55)',
          alpha: 0.75,
          life: 0,
          maxLife: 38 + Math.random() * 20,
        });
      }
      const timer = setTimeout(() => {
        if (onWindEnd) onWindEnd();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [windGust, onWindEnd]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 600;

    const pivotX = 500;
    const pivotY = 232;
    const dist = Math.hypot(x - pivotX, y - pivotY);

    if (dist < 290) {
      physicsRef.current.isDragging = true;
      soundManager.playForkClink();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!physicsRef.current.isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 600;

    const pivotX = 500;
    const pivotY = 232;
    const angle = Math.atan2(x - pivotX, Math.max(40, y - pivotY + 60));
    const clamped = Math.max(-0.55, Math.min(0.55, angle * 0.9));
    physicsRef.current.theta = clamped;
    physicsRef.current.omega = 0;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (physicsRef.current.isDragging) {
      physicsRef.current.isDragging = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const p = physicsRef.current;

      if (!p.isDragging) {
        p.alpha = -p.naturalFreqSq * Math.sin(p.theta) - 1.35 * p.omega;
        p.omega += p.alpha * dt;
        p.omega *= p.damping;
        p.theta += p.omega * dt;

        p.spinAngle += p.spinVel * dt;
        p.spinVel *= 0.988;
        if (Math.abs(p.spinVel) < 0.01) p.spinVel = 0;

        if (Math.abs(p.theta) < 0.004 && Math.abs(p.omega) < 0.004) {
          p.theta += Math.sin(time * 0.0022) * 0.0007;
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.life++;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife);
        if (pt.life >= pt.maxLife) particlesRef.current.splice(i, 1);
      }

      ctx.clearRect(0, 0, 1000, 600);

      drawStudioBackground(ctx, time, showVectors);
      drawApple(ctx, 500, 412);
      drawToothpick1(ctx, 500, 232);

      // Fully balanced fork + spoon + toothpick #2 around Pivot P (500, 232)
      ctx.save();
      ctx.translate(500, 232);
      ctx.rotate(p.theta);
      drawBalancedAssembly(ctx, p.spinAngle);
      ctx.restore();

      drawParticles(ctx);

      if (showVectors) {
        drawPhysicsOverlay(ctx, p);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [showVectors]);

  const drawStudioBackground = (ctx: CanvasRenderingContext2D, time: number, showGrid: boolean) => {
    const bgGrad = ctx.createLinearGradient(500, 0, 500, 440);
    bgGrad.addColorStop(0, '#0b0f19');
    bgGrad.addColorStop(0.55, '#18141c');
    bgGrad.addColorStop(1, '#120b07');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 440);

    BOKEH_LIGHTS.forEach((b, idx) => {
      const ox = b.x + Math.sin(time * 0.0005 + idx) * 14;
      const oy = b.y + Math.cos(time * 0.0004 + idx * 1.3) * 10;
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(0.75, b.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (showGrid) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.045)';
      ctx.lineWidth = 1;
      for (let x = 50; x < 1000; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 435);
        ctx.stroke();
      }
      for (let y = 40; y < 435; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1000, y);
        ctx.stroke();
      }
    }

    const tableY = 435;
    const woodGrad = ctx.createLinearGradient(0, tableY, 0, 600);
    woodGrad.addColorStop(0, '#784821');
    woodGrad.addColorStop(0.08, '#5e3516');
    woodGrad.addColorStop(0.45, '#3e210c');
    woodGrad.addColorStop(1, '#1d0e04');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(0, tableY, 1000, 600 - tableY);

    ctx.strokeStyle = '#9a6130';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, tableY);
    ctx.lineTo(1000, tableY);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 210, 150, 0.08)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 6; i++) {
      const gy = tableY + 22 + i * 24;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(320, gy - 5, 680, gy + 5, 1000, gy - 2);
      ctx.stroke();
    }

    const tableGlow = ctx.createRadialGradient(500, 475, 20, 500, 475, 360);
    tableGlow.addColorStop(0, 'rgba(253, 224, 150, 0.14)');
    tableGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tableGlow;
    ctx.fillRect(100, tableY, 800, 165);
  };

  const drawApple = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    ctx.save();
    ctx.translate(cx, cy);

    const shadowGrad = ctx.createRadialGradient(0, 64, 10, 0, 64, 82);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.68)');
    shadowGrad.addColorStop(0.65, 'rgba(0,0,0,0.28)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 64, 82, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.bezierCurveTo(22, -62, 68, -46, 66, 2);
    ctx.bezierCurveTo(64, 46, 32, 66, 10, 60);
    ctx.quadraticCurveTo(0, 56, -10, 60);
    ctx.bezierCurveTo(-32, 66, -64, 46, -66, 2);
    ctx.bezierCurveTo(-68, -46, -22, -62, 0, -48);
    ctx.closePath();

    const appleGrad = ctx.createRadialGradient(-20, -20, 12, 0, 0, 74);
    appleGrad.addColorStop(0, '#fef08a');
    appleGrad.addColorStop(0.35, '#fbbf24');
    appleGrad.addColorStop(0.68, '#ef4444');
    appleGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = appleGrad;
    ctx.fill();

    const blushGrad = ctx.createRadialGradient(28, -10, 8, 25, 0, 52);
    blushGrad.addColorStop(0, 'rgba(220, 38, 38, 0.55)');
    blushGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = blushGrad;
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.ellipse(-28, -24, 14, 7, -0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(69, 10, 10, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, -47, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#291509';
    ctx.beginPath();
    ctx.ellipse(0, -48, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawToothpick1 = (ctx: CanvasRenderingContext2D, x: number, pivotY: number) => {
    ctx.save();
    ctx.translate(x, pivotY);
    ctx.rotate(Math.PI / 2);
    drawSingleToothpick(ctx, 152, 3.2, true);
    ctx.restore();
  };

  const drawSingleToothpick = (
    ctx: CanvasRenderingContext2D,
    length: number,
    thickness: number,
    tipAtOrigin = false
  ) => {
    const startX = tipAtOrigin ? 0 : -length / 2;
    const endX = startX + length;
    const taper = 11;

    const grad = ctx.createLinearGradient(0, -thickness, 0, thickness);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.5, '#fde68a');
    grad.addColorStop(1, '#b45309');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + taper, -thickness / 2);
    ctx.lineTo(endX - taper, -thickness / 2);
    ctx.lineTo(endX, 0);
    ctx.lineTo(endX - taper, thickness / 2);
    ctx.lineTo(startX + taper, thickness / 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.5)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  };

  const drawBalancedAssembly = (ctx: CanvasRenderingContext2D, spinAngle: number) => {
    const cosSpin = Math.cos(spinAngle);
    const horizScale = Math.abs(cosSpin) < 0.22 ? (cosSpin >= 0 ? 0.22 : -0.22) : cosSpin;

    ctx.save();

    const jointX = 62 * horizScale;
    const jointY = -26;

    ctx.save();
    const tpAngle = Math.atan2(jointY, jointX);
    ctx.rotate(tpAngle);
    drawSingleToothpick(ctx, 118, 3.4, true);
    ctx.restore();

    if (cosSpin < 0) {
      drawBalancedSpoon(ctx, horizScale);
      drawBalancedFork(ctx, horizScale);
    } else {
      drawBalancedFork(ctx, horizScale);
      drawBalancedSpoon(ctx, horizScale);
    }

    ctx.restore();
  };

  const drawBalancedFork = (ctx: CanvasRenderingContext2D, horizScale: number) => {
    ctx.save();
    ctx.scale(horizScale, 1);

    const steelGrad = ctx.createLinearGradient(-210, -40, 90, 20);
    steelGrad.addColorStop(0, '#e2e8f0');
    steelGrad.addColorStop(0.25, '#94a3b8');
    steelGrad.addColorStop(0.55, '#f8fafc');
    steelGrad.addColorStop(0.8, '#64748b');
    steelGrad.addColorStop(1, '#cbd5e1');

    const tines = [-6, -2, 2, 6];
    ctx.lineCap = 'round';
    tines.forEach((ty, idx) => {
      ctx.strokeStyle = idx % 2 === 0 ? '#f1f5f9' : '#94a3b8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(28, -22 + ty * 0.6);
      ctx.quadraticCurveTo(58, -34 + ty, 88, -18 + ty * 0.5);
      ctx.stroke();
    });

    ctx.fillStyle = steelGrad;
    ctx.beginPath();
    ctx.moveTo(28, -24);
    ctx.bezierCurveTo(-25, -42, -110, -24, -215, -42);
    ctx.quadraticCurveTo(-224, -36, -214, -29);
    ctx.bezierCurveTo(-110, -14, -25, -30, 28, -14);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(25, -23);
    ctx.bezierCurveTo(-25, -40, -110, -22, -212, -40);
    ctx.stroke();

    ctx.restore();
  };

  const drawBalancedSpoon = (ctx: CanvasRenderingContext2D, horizScale: number) => {
    ctx.save();
    ctx.scale(horizScale, 1);

    const spoonGrad = ctx.createLinearGradient(50, -35, 115, 215);
    spoonGrad.addColorStop(0, '#f8fafc');
    spoonGrad.addColorStop(0.25, '#94a3b8');
    spoonGrad.addColorStop(0.55, '#e2e8f0');
    spoonGrad.addColorStop(0.85, '#475569');
    spoonGrad.addColorStop(1, '#cbd5e1');

    ctx.fillStyle = spoonGrad;
    ctx.beginPath();
    ctx.ellipse(68, -14, 18, 28, 0.35, 0, Math.PI * 2);
    ctx.fill();

    const bowlShadow = ctx.createRadialGradient(64, -18, 3, 68, -14, 22);
    bowlShadow.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    bowlShadow.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
    ctx.fillStyle = bowlShadow;
    ctx.beginPath();
    ctx.ellipse(68, -14, 13, 22, 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = spoonGrad;
    ctx.beginPath();
    ctx.moveTo(76, 8);
    ctx.bezierCurveTo(96, 55, 108, 135, 104, 212);
    ctx.quadraticCurveTo(97, 220, 89, 210);
    ctx.bezierCurveTo(92, 135, 82, 55, 65, 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(75, 10);
    ctx.bezierCurveTo(94, 58, 105, 135, 101, 208);
    ctx.stroke();

    ctx.restore();
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    particlesRef.current.forEach((pt) => {
      ctx.globalAlpha = pt.alpha;
      ctx.strokeStyle = pt.color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x - 24, pt.y + 1);
      ctx.stroke();
    });
    ctx.restore();
  };

  const drawPhysicsOverlay = (
    ctx: CanvasRenderingContext2D,
    physics: typeof physicsRef.current
  ) => {
    ctx.save();
    const pivotX = 500;
    const pivotY = 232;
    const d = 88;
    const comX = pivotX - d * Math.sin(physics.theta);
    const comY = pivotY + d * Math.cos(physics.theta);

    // Vertical plumb line through P
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY - 55);
    ctx.lineTo(pivotX, pivotY + 135);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pivot Point P
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '600 13px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Тулгуур цэг (P)', pivotX + 16, pivotY - 4);

    // Center of Mass G
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(comX, comY);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(comX, comY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(comX - 10, comY);
    ctx.lineTo(comX + 10, comY);
    ctx.moveTo(comX, comY - 10);
    ctx.lineTo(comX, comY + 10);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = '600 13px Outfit, sans-serif';
    ctx.fillText('Нийт хүндийн төв (G)', comX + 15, comY + 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('(Тулгуураас доор оршино)', comX + 15, comY + 19);

    // Force vectors
    drawArrow(ctx, pivotX, pivotY, pivotX, pivotY - 68, '#f59e0b', 'Тулгуурын урвал N');
    drawArrow(ctx, comX, comY, comX, comY + 68, '#10b981', 'Хүндийн хүч Fg = mg');

    if (Math.abs(physics.theta) > 0.04) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const startAng = Math.PI / 2;
      const endAng = startAng - physics.theta;
      ctx.arc(pivotX, pivotY, 46, Math.min(startAng, endAng), Math.max(startAng, endAng));
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      const torqueVal = (-Math.sin(physics.theta) * 0.92).toFixed(2);
      ctx.fillText(`τ = -mg·d·sinθ (${torqueVal} N·m)`, pivotX - 210, pivotY + 42);
    }

    ctx.restore();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    label: string
  ) => {
    const headLen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, toX + 10, toY + 4);
  };

  return (
    <div className="relative w-full aspect-[5/3] max-w-[1000px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-lg">
          Тэнцвэрийн гайхамшиг · Интерактив симуляци
        </span>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-slate-300 border border-slate-700/60 rounded-lg">
          Хулганаар татаж савлуулах эсвэл эргүүлж үзнэ үү
        </span>
      </div>
    </div>
  );
};
