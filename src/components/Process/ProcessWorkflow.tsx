import React, { useState } from 'react';
import { FileCode, Sliders, Play, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const ProcessWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'DESIGN',
      subtitle: 'Digital Model / CAD Inspection',
      icon: FileCode,
      summary:
        'Submit digital geometries in STL, STEP, OBJ, or 3MF. We inspect wall thicknesses, draft clearances, and overhang geometries to prepare files for optimal print orientation.',
      parameters: ['Watertight mesh verification', 'Topology analysis', 'Fillet & tolerance check'],
    },
    {
      step: '02',
      title: 'PREPARE',
      subtitle: 'Print Optimization & Slicing',
      icon: Sliders,
      summary:
        'Toolpaths are mathematically generated with adaptive layer heights, optimized infill densities (gyroid, honeycomb, cubic), and custom support structures designed for clean removal.',
      parameters: ['Toolpath trajectory calculation', 'Internal infill pattern tuning', 'Thermal shrinkage compensation'],
    },
    {
      step: '03',
      title: 'PRINT',
      subtitle: 'Layer-by-Layer Additive Manufacturing',
      icon: Play,
      summary:
        'Thermoplastics and carbon composites are deposited layer by layer in a temperature-regulated chamber with continuous micro-step extrusion control.',
      parameters: ['Automated first-layer leveling', 'Active vibration suppression', 'Continuous layer height monitoring'],
    },
    {
      step: '04',
      title: 'FINISH',
      subtitle: 'Post-Processing & Surface Treatment',
      icon: Sparkles,
      summary:
        'Parts undergo support extraction, bead blasting, heat annealing, or solvent smoothing depending on surface aesthetics and mechanical stress requirements.',
      parameters: ['Support removal without scar marks', 'Thermal annealing for crystallization', 'Brass heat-set insert installation'],
    },
    {
      step: '05',
      title: 'DELIVER',
      subtitle: 'Ready-to-Use Physical Product',
      icon: CheckCircle2,
      summary:
        'Parts undergo critical dimension inspection with digital calipers and go/no-go gauges, followed by protective packaging for rapid on-demand dispatch.',
      parameters: ['Quality inspection sign-off', 'Secure anti-scratch packaging', 'Direct courier dispatch'],
    },
  ];

  return (
    <section id="process" className="relative py-28 bg-[#0E0E10] border-t border-white/5 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
            <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
              SECTION 03 // WORKFLOW
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            THE ADDITIVE PROCESS
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400 text-sm font-sans leading-relaxed">
            A methodical 5-stage engineering pipeline designed to turn raw digital meshes into dimensionally stable, production-grade physical parts.
          </p>
        </div>

        {/* Horizontal Process Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`relative text-left p-3 sm:p-3.5 rounded-sm border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#18181D] border-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.25)]'
                    : 'bg-[#121214] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#FF7A00]' : 'text-zinc-400'}`}>
                    STEP {item.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF7A00]' : 'text-zinc-400'}`} />
                </div>
                <h4 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-300 font-sans truncate mt-0.5">
                  {item.subtitle}
                </p>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Engineering View */}
        <div className="p-5 sm:p-7 rounded-sm bg-[#141418] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-xs font-mono text-[#FF7A00] font-bold">
                STAGE {steps[activeStep].step}
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
                {steps[activeStep].title} — {steps[activeStep].subtitle}
              </h3>
            </div>
            <p className="mt-3 text-zinc-200 text-base leading-relaxed font-sans">
              {steps[activeStep].summary}
            </p>
          </div>

          <div className="lg:w-80 p-4 sm:p-5 rounded bg-[#0A0A0B] border border-white/10 shrink-0">
            <span className="text-xs font-mono tracking-widest text-[#FF7A00] uppercase font-bold block mb-2.5">
              TECHNICAL PROTOCOL
            </span>
            <div className="space-y-2">
              {steps[activeStep].parameters.map((param, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-zinc-200">
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF7A00] shrink-0 mt-0.5" />
                  <span>{param}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
