import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFramePreloader, DrawableFrame } from '../../hooks/useFramePreloader';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HeroTelemetryOverlay } from './HeroTelemetryOverlay';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface ScrollPrinterHeroProps {
  onStartProject: () => void;
  onExploreServices: () => void;
}

export const ScrollPrinterHero: React.FC<ScrollPrinterHeroProps> = ({
  onStartProject,
  onExploreServices,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const totalFrames = 240;

  // High-performance progressive preloader with instant milestone scrubbing
  const { frames, isReady, loadedCount } = useFramePreloader(
    totalFrames,
    './frames/frame_{num}.webp'
  );

  const framesRef = useRef(frames);
  framesRef.current = frames;

  // Decoupled UI telemetry state (throttled to avoid 60fps React re-renders)
  const [uiProgress, setUiProgress] = useState(0);

  // Scrub interpolation refs
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastDrawnActualFrameRef = useRef<DrawableFrame | null>(null);
  const lastUiUpdateRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isLoopActiveRef = useRef(false);

  // Cached geometry and canvas draw parameters (calculated ONLY on resize, NEVER during scroll/draw)
  const scrollGeometryRef = useRef({
    containerTop: 0,
    totalScrollable: 1,
  });

  const canvasDrawParamsRef = useRef({
    renderW: 1920,
    renderH: 1080,
    offsetX: 0,
    offsetY: 0,
  });

  // Fast direct canvas draw routine (0 DOM reads, pure GPU draw)
  const renderFrameToCanvas = useCallback(
    (canvas: HTMLCanvasElement, frame: DrawableFrame) => {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const { renderW, renderH, offsetX, offsetY } = canvasDrawParamsRef.current;
      ctx.drawImage(frame, offsetX, offsetY, renderW, renderH);
    },
    []
  );

  // High-performance scroll animation loop (attached ONCE, never re-triggered on frame arrivals)
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Calculate dimensions & geometry strictly on resize or orientation change
    const updateGeometryAndCanvas = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container) return;

      // 1. Scroll track layout metrics
      const rect = container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const totalScrollable = Math.max(container.offsetHeight - window.innerHeight, 1);
      scrollGeometryRef.current = { containerTop, totalScrollable };

      // 2. Canvas buffer allocation and cover math
      if (canvas) {
        const displayWidth = canvas.clientWidth || window.innerWidth;
        const displayHeight = canvas.clientHeight || window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let targetW = Math.round(displayWidth * dpr);
        let targetH = Math.round(displayHeight * dpr);
        const maxDim = 2560;
        if (targetW > maxDim || targetH > maxDim) {
          const scale = maxDim / Math.max(targetW, targetH);
          targetW = Math.round(targetW * scale);
          targetH = Math.round(targetH * scale);
        }

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const imgAspect = 1920 / 1080;
        const canvasAspect = targetW / targetH;
        let renderW = targetW;
        let renderH = targetH;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasAspect > imgAspect) {
          renderW = targetW;
          renderH = targetW / imgAspect;
          offsetY = (targetH - renderH) / 2;
        } else {
          renderH = targetH;
          renderW = targetH * imgAspect;
          offsetX = (targetW - renderW) / 2;
        }

        canvasDrawParamsRef.current = {
          renderW,
          renderH,
          offsetX,
          offsetY,
        };

        lastDrawnFrameRef.current = -1;
      }
    };

    // 60FPS RAF animation loop with adaptive lerp smoothing
    const updateAnimationLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      const absDiff = Math.abs(diff);

      // High-velocity responsive tracking: snaps instantly during active gestures, smoothly glides to rest
      if (absDiff > 0.0001) {
        const lerpSpeed = Math.min(0.70, 0.42 + absDiff * 0.90);
        currentProgressRef.current += diff * lerpSpeed;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      const frameIdx = Math.min(
        Math.max(Math.floor(p * (totalFrames - 1)), 0),
        totalFrames - 1
      );

      // Only draw when the frame index changes or on initial paint
      if (frameIdx !== lastDrawnFrameRef.current) {
        const canvas = canvasRef.current;
        if (canvas) {
          const currentFrames = framesRef.current;
          let frame = currentFrames[frameIdx];
          if (!frame) {
            // Find closest loaded frame anywhere in sequence (prevents frozen/blank canvas)
            let bestDist = Infinity;
            for (let i = 0; i < totalFrames; i++) {
              if (currentFrames[i]) {
                const dist = Math.abs(i - frameIdx);
                if (dist < bestDist) {
                  bestDist = dist;
                  frame = currentFrames[i];
                }
              }
            }
          }

          if (frame) {
            renderFrameToCanvas(canvas, frame);
            lastDrawnFrameRef.current = frameIdx;
            lastDrawnActualFrameRef.current = frame;
          }
        }

        // Throttle UI text state updates to ~16fps to keep main thread free for graphics
        const now = performance.now();
        if (now - lastUiUpdateRef.current > 60 || p === 1 || p === 0) {
          lastUiUpdateRef.current = now;
          setUiProgress(p);
        }
      }

      // Keep loop running while interpolating, pause when settled to preserve mobile battery/CPU
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0002) {
        rafIdRef.current = requestAnimationFrame(updateAnimationLoop);
      } else {
        isLoopActiveRef.current = false;
        setUiProgress(targetProgressRef.current);
      }
    };

    // Zero-reflow scroll listener (reads window.scrollY directly, 0ms execution)
    const handleScroll = () => {
      const { containerTop, totalScrollable } = scrollGeometryRef.current;
      const y = window.scrollY || window.pageYOffset;
      const scrolled = y - containerTop;
      targetProgressRef.current = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      // Wake up loop on scroll event if not already running
      if (!isLoopActiveRef.current) {
        isLoopActiveRef.current = true;
        rafIdRef.current = requestAnimationFrame(updateAnimationLoop);
      }
    };

    const handleResize = () => {
      updateGeometryAndCanvas();
      handleScroll();
    };

    updateGeometryAndCanvas();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [prefersReducedMotion, totalFrames, renderFrameToCanvas]);

  // Redraw initial frame when first loaded
  useEffect(() => {
    if (isReady && canvasRef.current && frames[0] && lastDrawnFrameRef.current === -1) {
      renderFrameToCanvas(canvasRef.current, frames[0]);
      lastDrawnFrameRef.current = 0;
      lastDrawnActualFrameRef.current = frames[0];
    }
  }, [isReady, frames, renderFrameToCanvas]);

  // Progressive real-time refinement: when background frames finish loading, sharpen current view
  useEffect(() => {
    if (!canvasRef.current || !frames) return;
    const p = currentProgressRef.current;
    const frameIdx = Math.min(
      Math.max(Math.floor(p * (totalFrames - 1)), 0),
      totalFrames - 1
    );
    const frame = frames[frameIdx];
    if (frame && lastDrawnActualFrameRef.current !== frame) {
      renderFrameToCanvas(canvasRef.current, frame);
      lastDrawnActualFrameRef.current = frame;
      lastDrawnFrameRef.current = frameIdx;
    }
  }, [loadedCount, frames, totalFrames, renderFrameToCanvas]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#0D1520]"
      id="hero-track"
    >
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Background Visual Layer */}
        {!prefersReducedMotion ? (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover select-none will-change-transform transform-gpu"
              style={{ transform: 'translateZ(0)' }}
            />
            {!isReady && (
              <img
                src="./hero_poster.webp"
                alt="Sologix Energy 3D Printer Hero"
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300"
              />
            )}
          </>
        ) : (
          /* Reduced-motion static experience */
          <div className="relative w-full h-full">
            <img
              src="./hero_poster.webp"
              alt="Sologix Energy High-Precision 3D Printer"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1520] via-[#0D1520]/40 to-transparent" />
          </div>
        )}

        {/* Laser Glow Beam Overlays (GPU hardware-accelerated CSS) */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient opacity-60" />

        {/* Telemetry & Technical HUD (Corner-docked, zero interference with chamber) */}
        <HeroTelemetryOverlay
          progress={uiProgress}
          currentFrame={Math.min(Math.round(uiProgress * 239) + 1, 240)}
          totalFrames={240}
        />

        {/* Completion Milestone Bar (Appears only when print is 100% complete, docked cleanly at bottom) */}
        {uiProgress >= 0.94 && (
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto animate-fade-in">
            <div className="p-4 sm:p-5 rounded-sm bg-[#16233A]/95 border border-[#FF7A00]/50 backdrop-blur-xl shadow-[0_0_30px_rgba(255,122,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-mono tracking-widest text-[#FF7A00] uppercase font-bold block">
                  3D PRINT COMPLETED // 240 FRAMES
                </span>
                <span className="text-sm font-sans text-zinc-200">
                  Ready to turn your CAD into a physical part?
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onStartProject}
                  className="px-5 py-2.5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all"
                >
                  <span>Start Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onExploreServices}
                  className="px-4 py-2.5 rounded-sm bg-[#0D1520] hover:bg-[#1E2D4A] text-zinc-200 font-mono text-xs uppercase tracking-wider border border-white/[0.08] transition-all"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Down Prompt (visible only when at the very top) */}
        {uiProgress < 0.08 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 text-zinc-400 font-mono text-xs tracking-widest uppercase pointer-events-none animate-bounce">
            <span>Scroll to Scrub 3D Printer</span>
            <ChevronDown className="w-4 h-4 text-[#FF7A00]" />
          </div>
        )}
      </div>
    </section>
  );
};
