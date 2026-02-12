import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
  darkMode?: boolean; // NEW
  children?: React.ReactNode;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#2563eb',
  trailCount = 3,
  sizes = [50, 90, 60],
  innerSizes = [15, 25, 20],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.4, 0.3, 0.3],
  shadowColor = 'rgba(0,0,0,0.2)',
  shadowBlur = 10,
  shadowOffsetX = 4,
  shadowOffsetY = 4,
  filterId = 'blob-fx-landing',
  filterStdDeviation = 25,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  fastDuration = 0.15,
  slowDuration = 0.6,
  fastEase = 'power2.out',
  slowEase = 'expo.out',
  zIndex = 100,
  darkMode = false, // NEW
  children
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  const updateOffset = useCallback(() => {
    if (!containerRef.current) return { left: 0, top: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const { left, top } = updateOffset();
      const x = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : (e as React.TouchEvent).touches[0].clientY;

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        gsap.to(el, {
          x: x - left,
          y: y - top,
          duration: isLead ? fastDuration : slowDuration + i * 0.1,
          ease: isLead ? fastEase : slowEase
        });
      });
    },
    [updateOffset, fastDuration, slowDuration, fastEase, slowEase]
  );

  useEffect(() => {
    const onResize = () => updateOffset();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateOffset]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className="relative w-full min-h-screen"
      style={{ zIndex }}
    >
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* SVG Filter */}
      {useFilter && (
        <svg className="absolute w-0 h-0 pointer-events-none">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      {/* Blob Cursor */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none cursor-default z-[20]"
        style={{
          filter: useFilter ? `url(#${filterId})` : undefined,
          mixBlendMode: darkMode ? 'lighten' : 'multiply'
        }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={el => {
              blobsRef.current[i] = el;
            }}
            className="absolute will-change-transform transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i] || 60,
              height: sizes[i] || 60,
              borderRadius: blobType === 'circle' ? '50%' : '0',
              backgroundColor: fillColor,
              opacity: opacities[i] || 0.4,
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`
            }}
          >
            {/* Inner Glow */}
            <div
              className="absolute"
              style={{
                width: innerSizes[i] || 20,
                height: innerSizes[i] || 20,
                top: ((sizes[i] || 60) - (innerSizes[i] || 20)) / 2,
                left: ((sizes[i] || 60) - (innerSizes[i] || 20)) / 2,
                backgroundColor: darkMode
                  ? 'rgba(255,255,255,0.35)'
                  : innerColor,
                borderRadius: blobType === 'circle' ? '50%' : '0'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
