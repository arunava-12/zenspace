import React, { useRef, useEffect } from 'react';

interface DarkVeilProps {
  hueShift?: number;
  speed?: number;
  resolutionScale?: number;
  warpAmount?: number;
}

const DarkVeil: React.FC<DarkVeilProps> = ({
  hueShift = 0,
  speed = 1,
  resolutionScale = 1,
  warpAmount = 0.2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth * resolutionScale * dpr;
      canvas.height = parent.clientHeight * resolutionScale * dpr;

      canvas.style.width = parent.clientWidth + 'px';
      canvas.style.height = parent.clientHeight + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const wave = (v: number, amp: number, freq: number) =>
      Math.sin(v * freq + time) * amp;

    const render = () => {
      // slower = smoother
      time += 0.002 * speed;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Base deep charcoal
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      // MULTI LAYER VEILS
      for (let i = 0; i < 4; i++) {
        const hue = (220 + hueShift + i * 18) % 360;

        const x =
          width / 2 +
          wave(width + i * 50, width * 0.15, 0.0008 + i * 0.0002);

        const y =
          height / 2 +
          wave(height + i * 70, height * 0.18, 0.001 + i * 0.00025);

        const radius =
          width * (0.65 + Math.sin(time * 0.5 + i) * 0.12);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);

        grad.addColorStop(0, `hsla(${hue}, 50%, 20%, 0.28)`);
        grad.addColorStop(0.4, `hsla(${hue + 10}, 40%, 10%, 0.14)`);
        grad.addColorStop(1, 'rgba(9,9,11,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.globalCompositeOperation = 'source-over';

      // SOFT VIGNETTE (depth illusion)
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.4,
        width / 2,
        height / 2,
        width * 0.9
      );

      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hueShift, speed, resolutionScale, warpAmount]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none"
    />
  );
};

export default DarkVeil;
