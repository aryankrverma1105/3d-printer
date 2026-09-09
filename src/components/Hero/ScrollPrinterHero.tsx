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

  // Optimized Preloader with memory-capping for low-end systems
  const { frames, isReady } = useFramePreloader(
    totalFrames,
    './frames/frame_{num}.webp'
  );

  // Decoupled UI telemetry state (throttled to avoid 60fps React re-renders)
  const [uiProgress, setUiProgress] = useState(0);
  const [uiFrameIndex, setUiFrameIndex] = useState(0);

  // Scrub interpolation refs
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastUiUpdateRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Fast direct canvas draw routine (optimized for 60fps on low-end hardware)
  const renderFrameToCanvas = useCallback(
    (canvas: HTMLCanvasElement, frame: DrawableFrame) => {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // Cap internal canvas buffer to max 1920x1080 (prevents 4K GPU memory bloat on low-end laptops)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const targetW = Math.min(Math.round(displayWidth * dpr), 1920);
      const targetH = Math.min(Math.round(displayHeight * dpr), 1080);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // Aspect ratio containment
      const imgWidth = (frame as ImageBitmap).width || 1920;
      const imgHeight = (frame as ImageBitmap).height || 1080;
      const imgAspect = imgWidth / imgHeight;
      const canvasAspect = targetW / targetH;

      let renderW = targetW;
      let renderH = targetH;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        renderH = targetH;
        renderW = targetH * imgAspect;
        offsetX = (targetW - renderW) / 2;
      } else {
        renderW = targetW;
        renderH = targetW / imgAspect;
        offsetY = (targetH - renderH) / 2;
      }

      // Draw frame directly (vignette is handled in hardware via CSS overlay)
      ctx.drawImage(frame, offsetX, offsetY, renderW, renderH);
    },
    []
  );

  // High-performance scroll animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const raw = scrolled / totalScrollable;
      targetProgressRef.current = Math.min(Math.max(raw, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    // 60FPS RAF animation loop with lerp smoothing
    const updateAnimationLoop = () => {
      // Exponential smoothing (0.16 lerp factor provides fluid momentum without sluggishness)
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.16;
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
          // Find target frame or fallback to nearest loaded frame
          let frame = frames[frameIdx];
          if (!frame) {
            for (let offset = 1; offset < 24; offset++) {
              if (frameIdx - offset >= 0 && frames[frameIdx - offset]) {
                frame = frames[frameIdx - offset];
                break;
              }
              if (frameIdx + offset < totalFrames && frames[frameIdx + offset]) {
                frame = frames[frameIdx + offset];
                break;
              }
            }
          }

          if (frame) {
            renderFrameToCanvas(canvas, frame);
            lastDrawnFrameRef.current = frameIdx;
          }
        }

        // Throttle UI text state update to save React render cycles on low-end systems
        const now = performance.now();
        if (now - lastUiUpdateRef.current > 40 || p === 1 || p === 0) {
          lastUiUpdateRef.current = now;
          setUiProgress(p);
          setUiFrameIndex(frameIdx);
        }
      }

      rafIdRef.current = requestAnimationFrame(updateAnimationLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateAnimationLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [frames, prefersReducedMotion, totalFrames, renderFrameToCanvas]);

  // Redraw initial frame when first loaded
  useEffect(() => {
    if (isReady && canvasRef.current && frames[0] && lastDrawnFrameRef.current === -1) {
      renderFrameToCanvas(canvasRef.current, frames[0]);
      lastDrawnFrameRef.current = 0;
    }
  }, [isReady, frames, renderFrameToCanvas]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#0A0A0B]"
      id="hero-track"
    >
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Semantic H1 for SEO Integrity (Visually unhindered) */}
        <h1 className="sr-only">
          Sologix Energy — Precision Additive Manufacturing & Industrial 3D Printing
        </h1>

        {/* Background Visual Layer */}
        {!prefersReducedMotion ? (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover select-none"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
          </div>
        )}

        {/* Laser Glow Beam Overlays (GPU hardware-accelerated CSS) */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient opacity-60" />

        {/* Telemetry & Technical HUD (Corner-docked, zero interference with chamber) */}
        <HeroTelemetryOverlay
          progress={uiProgress}
          currentFrame={uiFrameIndex + 1}
          totalFrames={totalFrames}
        />

        {/* Completion Milestone Bar (Appears only when print is 100% complete, docked cleanly at bottom) */}
        {uiProgress >= 0.94 && (
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto animate-fade-in">
            <div className="p-4 sm:p-5 rounded-sm bg-[#0A0A0B]/90 border border-[#FF7A00]/50 backdrop-blur-xl shadow-[0_0_30px_rgba(255,122,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  className="px-4 py-2.5 rounded-sm bg-[#16161A] hover:bg-[#202026] text-zinc-200 font-mono text-xs uppercase tracking-wider border border-white/10 transition-all"
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
