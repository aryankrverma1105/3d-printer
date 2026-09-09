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
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-8 lg:p-12 pt-24 sm:pt-28 lg:pt-32">
      {/* Top Technical HUD Bar */}
      <div className="flex items-start justify-between w-full">
        {/* System Telemetry Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#121214]/90 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-200 uppercase font-semibold">
            BAMBU LAB X2D // <span className="text-[#FF7A00]">FLEET CORE</span>
          </span>
        </div>

        {/* Machine Telemetry Readout */}
        <div className="hidden sm:flex flex-col items-end gap-1.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-4 bg-[#121214]/90 border border-white/10 backdrop-blur-md px-4 py-2 rounded">
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

      {/* Center Reticle Corner Marks */}
      <div className="absolute inset-16 pointer-events-none hidden md:block opacity-25">
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/40" />
      </div>

      {/* Bottom Control Bar */}
      <div className="flex items-end justify-between w-full">
        {/* Machine Control Prompt */}
        <div className="flex items-center gap-3 bg-[#0A0A0B]/90 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded">
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
        <div className="flex items-center gap-3 bg-[#121214]/90 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded">
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
  );
};
