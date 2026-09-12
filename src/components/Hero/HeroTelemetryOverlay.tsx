import { Activity, Thermometer, Disc3, Crosshair } from 'lucide-react';

interface HeroTelemetryOverlayProps {
  progress: number;
  currentFrame: number;
  totalFrames: number;
}

export const HeroTelemetryOverlay: React.FC<HeroTelemetryOverlayProps> = ({
  progress,
  currentFrame,
  totalFrames,
}) => {
  const percent = Math.round(progress * 100);

  // Simulated telemetry calculations based on scroll progress
  const simulatedExtruderTemp = progress > 0.15 && progress < 0.9 ? 255 : Math.round(180 + progress * 75);
  const simulatedBedTemp = 65;
  const simulatedLayer = Math.min(Math.round(progress * 420), 420);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-8 lg:p-12 pt-16 sm:pt-24 lg:pt-28 pb-3 sm:pb-8">
      {/* Top Technical HUD Bar */}
      <div className="flex items-start justify-between w-full">
        {/* System Telemetry Badge with subtle anti-gravity float */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-sm bg-[#16233A]/90 border border-white/[0.08] backdrop-blur-md animate-antigravity-float shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF7A00] animate-ping" />
          <span className="text-[10px] sm:text-sm font-mono tracking-widest text-zinc-200 uppercase font-semibold">
            BAMBU LAB X2D // <span className="text-[#FF7A00]">FLEET CORE</span>
          </span>
        </div>

        {/* Machine Telemetry Readout */}
        <div className="hidden sm:flex flex-col items-end gap-1.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-4 bg-[#16233A]/90 border border-white/[0.08] backdrop-blur-md px-4 py-2 rounded">
            <span className="flex items-center gap-1.5 text-zinc-200">
              <Thermometer className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>NOZZLE: <strong className="text-white">{simulatedExtruderTemp}°C</strong></span>
            </span>
            <span className="w-px h-3 bg-white/15" />
            <span className="flex items-center gap-1.5 text-zinc-200">
              <Activity className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>BED: <strong className="text-white">{simulatedBedTemp}°C</strong></span>
            </span>
            <span className="w-px h-3 bg-white/15" />
            <span className="flex items-center gap-1.5 text-zinc-200">
              <Disc3 className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>LAYER: <strong className="text-white">{simulatedLayer}/420</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 pr-1">
            <span>SEQUENCE: {String(currentFrame).padStart(3, '0')} / {totalFrames}</span>
            <span>•</span>
            <span>BUFFER: 100% HARDWARE ACCEL</span>
          </div>
        </div>
      </div>

      {/* Hero Headline Overlay (Visible on initial view, quickly eases away on scroll to keep printer 100% unobstructed) */}
      <div
        className={`pointer-events-auto max-w-xs sm:max-w-lg transition-all duration-300 mt-1 sm:mt-2 ${
          progress > 0.05 ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-[9px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
          00 // ON-DEMAND ADDITIVE MANUFACTURING
        </div>
        <h1 className="text-lg sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight uppercase leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Precision 3D Printing & Serial Production
        </h1>
        <p className="hidden sm:block text-xs sm:text-sm text-zinc-200 mt-1.5 max-w-md font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Industrial-grade rapid prototyping and serial batches in 25+ engineering polymers. Calibrated to ±0.1mm tolerance, dispatched in under 24 hours.
        </p>
      </div>

      {/* Center Reticle Corner Marks with Anti-Gravity Float */}
      <div className="absolute inset-16 pointer-events-none hidden md:block opacity-35 animate-antigravity-float">
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/40" />
      </div>

      {/* Bottom Control Bar */}
      <div className="w-full">
        {/* Mobile: Sleek, low-profile unified dock bar (prevents chamber/build plate blockage) */}
        <div className="flex sm:hidden items-center justify-between w-full bg-[#16233A]/95 border border-white/[0.08] backdrop-blur-md px-3 py-1.5 rounded shadow-lg">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-[#FF7A00] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-[11px] font-mono text-zinc-200">
              {percent < 100 ? 'Scroll to scrub machine' : 'Print complete'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#FF7A00]">{percent}%</span>
            <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF7A00] transition-all duration-75 shadow-[0_0_8px_#FF7A00]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop: Full side-by-side industrial control panels */}
        <div className="hidden sm:flex items-end justify-between w-full">
          {/* Machine Control Prompt */}
          <div className="flex items-center gap-3 bg-[#16233A]/90 border border-white/[0.08] backdrop-blur-md px-4 py-2.5 rounded">
            <Crosshair className="w-4 h-4 text-[#FF7A00] animate-spin" style={{ animationDuration: '8s' }} />
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-widest text-[#FF7A00] uppercase font-bold">
                SCROLL INTERACTION
              </span>
              <span className="text-sm font-mono text-zinc-200">
                {percent < 100 ? 'Scroll to scrub machine timeline' : 'Process completed • Explore services'}
              </span>
            </div>
          </div>

          {/* Global Progress Dial / Indicator */}
          <div className="flex items-center gap-3 bg-[#16233A]/90 border border-white/[0.08] backdrop-blur-md px-4 py-2.5 rounded">
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-medium">
                PRINT PROGRESS
              </span>
              <span className="text-lg font-mono font-bold text-white flex items-center gap-1">
                <span className="text-[#FF7A00]">{percent}%</span>
              </span>
            </div>

            <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF7A00] transition-all duration-75 shadow-[0_0_8px_#FF7A00]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
