import React from 'react';
import { FastForward, Maximize2, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  const benefits = [
    {
      icon: FastForward,
      title: 'Accelerated Physical Cycles',
      description: 'Compress physical test intervals from months to days by going straight from CAD revision to bed adhesion without waiting on external machine shops.',
    },
    {
      icon: Maximize2,
      title: 'Unrestricted Geometry',
      description: 'Manufacture internal conformal cooling channels, undercut pockets, and organic lattice cores impossible with 3-axis or 5-axis subtractive milling.',
    },
    {
      icon: RefreshCw,
      title: 'Iterative Engineering',
      description: 'Refine snap-fits, tolerances, and assembly ergonomics with each sequential prototype until real-world physical behavior matches simulation.',
    },
    {
      icon: Layers,
      title: 'Zero Tooling Delay',
      description: 'Eliminate expensive initial tooling capital and multi-week lead times. Start production runs immediately with zero tooling lock-in.',
    },
  ];

  return (
    <section id="why-sologix" className="relative py-32 bg-[#0E0E10] border-t border-white/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Bold Editorial Statement */}
          <div className="lg:col-span-6 lg:sticky lg:top-32">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                SECTION 07 // PHILOSOPHY
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-[1.05] uppercase">
              BUILT FOR<br />
              <span className="text-[#FF7A00]">ITERATION.</span>
            </h2>

            <blockquote className="mt-8 text-lg sm:text-xl font-sans text-zinc-300 font-light leading-relaxed border-l-2 border-[#FF7A00] pl-6">
              “The fastest way to improve a physical product is to make it, test it, and make it better.”
            </blockquote>

            <p className="mt-6 text-sm text-zinc-400 font-sans leading-relaxed">
              Traditional manufacturing forces hardware teams to gamble on high-stakes, expensive tooling. Sologix Energy replaces rigid assembly pipelines with agile additive manufacturing—giving you the freedom to test, refine, and ship without hesitation.
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-6 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
                <span>Zero Tooling Lock-In</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>On-Demand Capacity</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Benefits Matrix */}
          <div className="lg:col-span-6 space-y-3.5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-sm bg-[#141418] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5 mb-2">
                    <div className="w-8.5 h-8.5 rounded-sm bg-[#1A1A20] border border-white/10 flex items-center justify-center text-[#FF7A00] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed pl-12">
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
