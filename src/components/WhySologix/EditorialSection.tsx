import React from 'react';
import { FastForward, Maximize2, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const EditorialSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const benefits = [
    {
      icon: FastForward,
      title: 'Accelerated Physical Cycles',
      description: 'Compress iteration intervals from months to days by going straight from CAD revision to print bed adhesion without waiting weeks on external tooling suppliers.',
    },
    {
      icon: Maximize2,
      title: 'Unrestricted Geometry',
      description: 'Manufacture internal conformal cooling channels, organic topology-optimized lattice structures, and deep undercut cavities impossible with CNC milling.',
    },
    {
      icon: RefreshCw,
      title: 'Iterative Engineering',
      description: 'Refine snap-fits, tolerances, and assembly ergonomics with each sequential physical unit until real-world mechanical behavior matches CAD simulation.',
    },
    {
      icon: Layers,
      title: 'Zero Tooling Delay',
      description: 'Eliminate high upfront capital expense and tooling lead-times. Start production runs immediately with the agility to modify designs mid-batch.',
    },
  ];

  return (
    <section id="why-sologix" ref={ref} className="relative py-20 bg-[#0D1520] border-t border-white/[0.08]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Bold Editorial Statement */}
          <div
            className={`lg:col-span-6 lg:sticky lg:top-32 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                06 // ENGINEERING ADVANTAGE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-[1.05] uppercase">
              BUILT FOR<br />
              <span className="text-[#FF7A00]">RAPID ITERATION.</span>
            </h2>

            <blockquote className="mt-8 text-lg sm:text-xl font-sans text-zinc-200 font-light leading-relaxed border-l-2 border-[#FF7A00] pl-6">
              “The fastest way to engineer a superior physical product is to manufacture it, stress-test it, and iterate without friction.”
            </blockquote>

            <p className="mt-6 text-base text-zinc-300 font-sans leading-relaxed">
              Traditional manufacturing forces hardware teams to gamble on high-stakes, expensive tooling. Sologix Energy replaces rigid assembly pipelines with agile additive manufacturing—giving you the freedom to test, refine, and ship without hesitation.
            </p>

            <div className="mt-8 pt-8 border-t border-white/[0.08] flex items-center gap-6 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-zinc-200">Zero Tooling Lock-In</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-200">On-Demand Fleet Capacity</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Benefits Matrix */}
          <div className="lg:col-span-6 space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  className={`p-6 sm:p-7 rounded-sm bg-[#16233A] border border-white/[0.08] hover:border-[#2E90D9]/40 hover:shadow-[0_4px_24px_rgba(46,144,217,0.08)] transition-all duration-300 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-11 h-11 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] shrink-0">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-base text-zinc-300 font-sans leading-relaxed pl-15">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
