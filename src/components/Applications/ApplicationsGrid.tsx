import React from 'react';
import { APPLICATIONS } from '../../data/applications';
import { ArrowRight, Compass, Shield, Wrench, Cuboid as Cube, Cpu } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface ApplicationsGridProps {
  onSelectApplication: (appTitle: string) => void;
}

export const ApplicationsGrid: React.FC<ApplicationsGridProps> = ({ onSelectApplication }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const iconMap: Record<string, React.ElementType> = {
    'functional-prototypes': Cube,
    'industrial-jigs': Wrench,
    'electronic-enclosures': Cpu,
    'aerospace-robotics': Compass,
    'architectural-models': Shield,
    'small-batch': Cube,
  };

  return (
    <section id="applications" ref={ref} className="relative py-20 bg-[#F5F8FC] text-[#1F2937] border-t border-slate-200/60">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-xs uppercase tracking-widest font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              <span>05 // USE CASES & APPLICATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
              ENGINEERED APPLICATIONS
            </h2>
          </div>
          <p className="max-w-md text-[#5B6B7F] text-xs sm:text-sm font-sans leading-relaxed">
            From precision snap-fit enclosures to structural shop-floor jigs, explore how on-demand additive manufacturing solves physical hardware bottlenecks.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPLICATIONS.map((app, idx) => {
            const Icon = iconMap[app.id] || Cube;
            const isBlueBadge = idx % 2 === 1;
            return (
              <div
                key={app.id}
                style={{ transitionDelay: `${idx * 60}ms` }}
                className={`group relative p-6 sm:p-7 rounded-sm bg-white shadow-[0_2px_12px_rgba(15,26,43,0.06)] hover:shadow-[0_8px_24px_rgba(15,26,43,0.12)] flex flex-col justify-between transition-all duration-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-xs font-mono tracking-widest font-bold uppercase ${
                        isBlueBadge ? 'text-[#2E90D9]' : 'text-[#FF7A00]'
                      }`}
                    >
                      {app.tag}
                    </span>
                    {/* Circular Icon Badge with alternating #2E90D9 accent */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-200 ${
                        isBlueBadge
                          ? 'bg-[#2E90D9]/10 border border-[#2E90D9]/30 text-[#2E90D9] group-hover:bg-[#2E90D9]/20'
                          : 'bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] group-hover:bg-[#FF7A00]/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-[#0F1A2B] mb-2.5 group-hover:text-[#FF7A00] transition-colors">
                    {app.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed mb-6">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="space-y-2 mb-5 text-xs font-mono">
                    <div className="flex justify-between text-[#5B6B7F]">
                      <span>Dispatch SLA:</span>
                      <span className="text-[#1F2937] font-semibold">{app.leadTime}</span>
                    </div>
                    <div className="flex justify-between text-[#5B6B7F]">
                      <span>Target Polymers:</span>
                      <span className="text-[#FF7A00] font-semibold">{app.typicalMaterials.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectApplication(app.title)}
                    className="w-full py-2.5 px-4 rounded-sm bg-[#0D1520] hover:bg-[#FF7A00] text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,122,0,0.3)]"
                  >
                    <span>Quote This Application</span>
                    <ArrowRight className="w-4 h-4" />
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
