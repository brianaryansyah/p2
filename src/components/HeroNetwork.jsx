import { useEffect, useRef } from 'react';

const LINK_DIST = 120;
const MOUSE_RADIUS = 170;
const PACKET_SPAWN_INTERVAL = 900;

/**
 * Interactive "data-routing" network layer for the hero.
 * Nodes drift, connect to nearby peers, react to the pointer, and
 * occasionally fire a travelling packet across a link (routing theme).
 * Pure canvas + rAF — no per-frame React state.
 */
const HeroNetwork = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = 0;
    let running = true;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, active: false };
    let nodes = [];
    let packets = [];

    const makeNodes = () => {
      const count = Math.max(28, Math.min(70, Math.round((width * height) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || canvas.clientWidth || window.innerWidth;
      height = rect?.height || canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeNodes();
    };

    const spawnPacket = () => {
      if (packets.length >= 4 || nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * (nodes.length - 1));
      if (b >= a) b += 1;
      const na = nodes[a];
      const nb = nodes[b];
      const dist = Math.hypot(nb.x - na.x, nb.y - na.y);
      if (dist > LINK_DIST) return;
      packets.push({
        from: na,
        to: nb,
        t: 0,
        speed: 0.004 + Math.random() * 0.006,
      });
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (mouse.active) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 0.001) {
            const push = (1 - dist / MOUSE_RADIUS) * 0.6;
            node.x += (dx / dist) * push;
            node.y += (dy / dist) * push;
          }
        }

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      // Links between nearby nodes
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK_DIST) continue;
          const alpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Cursor link halo
      if (mouse.active) {
        for (const node of nodes) {
          const dist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          if (dist > MOUSE_RADIUS) continue;
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.5;
          ctx.strokeStyle = `rgba(163,230,53,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(163,230,53,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nodes
      for (const node of nodes) {
        const nearPointer = mouse.active && Math.hypot(node.x - mouse.x, node.y - mouse.y) < MOUSE_RADIUS;
        ctx.fillStyle = nearPointer ? '#a3e635' : 'rgba(0,0,0,0.28)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * (nearPointer ? 1.6 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // Travelling packets
      packets = packets.filter((p) => p.t < 1);
      for (const p of packets) {
        p.t += p.speed;
        const x = p.from.x + (p.to.x - p.from.x) * p.t;
        const y = p.from.y + (p.to.y - p.from.y) * p.t;
        const glow = Math.sin(p.t * Math.PI);
        ctx.fillStyle = '#a3e635';
        ctx.shadowColor = 'rgba(163,230,53,0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 2.2 * glow + 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (running) rafId = requestAnimationFrame(step);
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running) {
        rafId = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });

    if (reducedMotion) {
      step();
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
      };
    }

    const packetTimer = setInterval(spawnPacket, PACKET_SPAWN_INTERVAL);
    rafId = requestAnimationFrame(step);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearInterval(packetTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={`${className} pointer-events-none`} aria-hidden="true" />;
};

export default HeroNetwork;
