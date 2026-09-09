import React from 'react';
import { APPLICATIONS } from '../../data/applications';
import { ArrowRight, Compass, Shield, Wrench, Cuboid as Cube, Cpu } from 'lucide-react';

interface ApplicationsGridProps {
  onSelectApplication: (appTitle: string) => void;
}

export const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({ onSelectApplication }) => {
  const iconMap: Record<string, React.ElementType> = {
    'functional-prototypes': Cube,
    'industrial-jigs': Wrench,
    'electronic-enclosures': Cpu,
    'aerospace-robotics': Compass,
    'architectural-models': Shield,
    'small-batch': Cube,
  };

  return (
    <section id="applications" className="relative py-28 bg-[#0E0E10] border-t border-white/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                SECTION 05 // USE CASES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
              ENGINEERED APPLICATIONS
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-sans leading-relaxed">
            From one-off ergonomic models to mission-critical assembly jigs, explore how precision additive manufacturing solves physical engineering challenges.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {APPLICATIONS.map((app) => {
            const Icon = iconMap[app.id] || Cube;
            return (
              <div
                key={app.id}
                className="group relative p-5 sm:p-6 rounded-sm bg-[#121214] border border-white/5 hover:border-[#FF7A00]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,122,0,0.12)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono tracking-widest text-[#FF7A00] font-bold">
                      {app.tag}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-[#18181D] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#FF7A00] group-hover:border-[#FF7A00]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">
                    {app.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-4">
                    {app.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/10">
                  <div className="space-y-1.5 mb-4 text-xs sm:text-sm font-mono">
                    <div className="flex justify-between text-zinc-300">
                      <span>Lead Time:</span>
                      <span className="text-zinc-100 font-semibold">{app.leadTime}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Materials:</span>
                      <span className="text-[#FF7A00] font-semibold">{app.typicalMaterials.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectApplication(app.title)}
                    className="w-full py-2 px-3.5 rounded-sm bg-[#16161A] hover:bg-[#FF7A00] text-zinc-200 hover:text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between transition-colors duration-200"
                  >
                    <span>Request Application Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
