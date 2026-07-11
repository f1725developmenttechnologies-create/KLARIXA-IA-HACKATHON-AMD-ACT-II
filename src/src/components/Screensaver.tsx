import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface WaveParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  amplitude: number;
  opacity: number;
  color: string;
  phase: number;
}

export default function Screensaver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const { coherence, fps, setScreensaverActive, setSystemActive } = useStore();
  const [time, setTime] = useState(new Date());
  const [showTip, setShowTip] = useState(false);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show tip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Cosmic wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const waves: WaveParticle[] = Array.from({ length: 80 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 1,
      speed: 0.2 + Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      amplitude: 20 + Math.random() * 60,
      opacity: 0.1 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? '#FFD700' : '#00D4FF',
      phase: i * 0.3,
    }));

    let frame = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      frame++;

      // Dark gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, '#0D0D1A');
      gradient.addColorStop(0.5, '#08081A');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < 150; i++) {
        const sx = (i * 137.5) % canvas.width;
        const sy = (i * 97.3) % canvas.height;
        const brightness = 0.3 + Math.sin(frame * 0.02 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
        ctx.fill();
      }

      // Draw cosmic tsunami waves
      waves.forEach((w, i) => {
        const offsetX = Math.sin(frame * 0.02 + w.phase) * w.amplitude;
        const offsetY = Math.cos(frame * 0.015 + w.phase * 0.7) * w.amplitude * 0.6;
        const x = w.x + offsetX + Math.sin(frame * 0.01 + i) * 20;
        const y = w.y + offsetY + Math.cos(frame * 0.012 + i * 0.5) * 15;

        // Size pulse
        const sizePulse = Math.sin(frame * 0.05 + w.phase) * 0.5 + 1;
        const size = w.size * sizePulse;

        // Draw wave particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, w.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = w.opacity * (0.6 + Math.sin(frame * 0.03 + w.phase) * 0.3);
        ctx.fill();

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = w.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Draw central coherence ring
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const ringRadius = 60;

      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, (coherence / 100) * Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 + Math.sin(frame * 0.03) * 0.2})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glow on ring
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00D4FF';
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [coherence]);

  const handleEnter = () => {
    setScreensaverActive(false);
    setSystemActive(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 screensaver-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleEnter}
        onMouseMove={handleEnter}
        onTouchStart={handleEnter}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* KLARIXA Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
          <motion.div
            className="text-6xl md:text-8xl font-heading font-bold gradient-text mb-4"
            animate={{ opacity: [0.7, 1, 0.7], filter: ['brightness(0.8)', 'brightness(1.3)', 'brightness(0.8)'] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            KLARIXA
          </motion.div>
          <motion.p
            className="text-sm md:text-base font-mono text-muted tracking-[0.3em] uppercase"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            · Coherencia · Energía · Soberanía ·
          </motion.p>
        </div>

        {/* Bottom metrics bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="glass border-t border-primary/10 px-6 py-3">
            <div className="flex justify-between items-center text-xs font-mono text-muted max-w-4xl mx-auto">
              <span>COHERENCIA: <span className="text-primary">{coherence.toFixed(1)}%</span></span>
              <span className="hidden sm:inline">SISTEMA: <span className="text-success">ACTIVO</span></span>
              <span className="hidden md:inline">FPS: <span className="text-secondary">{fps}</span></span>
              <span className="hidden md:inline">RESOLUCIÓN: AMD RADEON</span>
              <span>{time.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Tap to enter tip */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={showTip ? { opacity: [0, 0.6, 0], y: [10, 0, -10] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <span className="text-xs text-muted font-mono tracking-wider">TOCA PARA ENTRAR</span>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-secondary/20 rounded-tr-xl" />
        <div className="absolute bottom-20 left-6 w-16 h-16 border-l-2 border-b-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-20 right-6 w-16 h-16 border-r-2 border-b-2 border-secondary/20 rounded-br-xl" />
      </motion.div>
    </AnimatePresence>
  );
}