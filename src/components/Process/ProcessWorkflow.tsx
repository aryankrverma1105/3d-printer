import React, { useState } from 'react';
import { UploadCloud, FileCheck, Cpu, Truck, CheckCircle2, Shield } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

export const ProcessWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const orderingSteps = [
    {
      num: '1',
      title: 'Upload CAD File',
      subtitle: 'Instant Mesh & Format Check',
      icon: UploadCloud,
      summary:
        'Upload your 3D design files in .STL, .STEP, .STP, .OBJ, or .3MF. Our geometric verification engine inspects non-manifold edges, wall thicknesses, and internal volumes immediately.',
      bullets: [
        'Automated watertight mesh check',
        'Direct STEP / STP parametric support',
        'Encrypted NDA-protected file vault',
      ],
    },
    {
      num: '2',
      title: 'Receive Engineering Quote',
      subtitle: 'Fast DFM Review & Pricing',
      icon: FileCheck,
      summary:
        'Our additive application engineers review print orientation, calculate thermal shrinkage compensation, and deliver a transparent quotation tailored to your polymer specifications.',
      bullets: [
        'Detailed DFM manufacturability feedback',
        '30–60 min quotation turnaround',
        'Transparent volume & material pricing',
      ],
    },
    {
      num: '3',
      title: 'Production & Quality Check',
      subtitle: 'Fleet Additive Manufacturing',
      icon: Cpu,
      summary:
        'Your parts enter our continuous 24/7 additive production fleet. Using dual-sensor optical bed leveling and vibration compensation, parts are printed to strict ±0.1mm tolerances.',
      bullets: [
        '±0.1 mm repeatable dimensional tolerance',
        'Automated layer-by-layer optical check',
        'Optional heat-set inserts & post-curing',
      ],
    },
    {
      num: '4',
      title: 'Doorstep Delivery',
      subtitle: 'Express Indian Metro Dispatch',
      icon: Truck,
      summary:
        'Parts undergo digital caliper verification and Go/No-Go inspection, followed by static-free protective packaging and priority courier dispatch across all major Indian industrial hubs.',
      bullets: [
        'Under 24 hours production turnaround',
        'Priority air express across Bengaluru, Pune, NCR, etc.',
        'Official B2B GST tax invoice with ITC',
      ],
    },
  ];

  return (
    <section
      id="process"
      ref={ref}
      className="relative py-20 bg-[#D6E6F5] text-[#1F2937] border-y border-[#C9DBEC] overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-xs uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
            <span>02 // OUR ORDERING PROCESS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
            HOW THE SOLOGIX PLATFORM WORKS
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed">
            From digital CAD upload to verified physical doorstep delivery across India in 4 seamless stages.
          </p>
        </div>

        {/* 4-Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {orderingSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`relative p-5 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-2 border-[#FF7A00] shadow-[0_8px_24px_rgba(255,122,0,0.18)] -translate-y-1'
                    : 'bg-white hover:bg-slate-50 border border-[#C9DBEC] hover:border-[#2E90D9]/40 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/40 flex items-center justify-center text-[#FF7A00] font-display font-black text-sm">
                      {step.num}
                    </div>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-[#FF7A00] text-black shadow-sm'
                          : 'bg-slate-100 text-[#5B6B7F]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-[#0F1A2B] mb-1">
                    {step.title}
                  </h3>
                  <div className="text-xs font-mono font-medium text-[#FF7A00] mb-2.5">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-[#5B6B7F] font-sans leading-relaxed mb-4">
                    {step.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#C9DBEC]/60 space-y-1.5">
                  {step.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-[11px] font-sans text-[#1F2937]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-[#FF7A00] text-black font-mono font-bold text-[10px] tracking-wider uppercase shadow">
                    Active Stage
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Highlighted Technical Stage Inspector Banner */}
        <div className="p-5 sm:p-6 rounded-sm bg-white text-[#1F2937] border border-[#C9DBEC] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30 font-mono text-xs font-bold uppercase">
                Stage {orderingSteps[activeStep].num} Protocol
              </span>
              <span className="text-xs font-mono text-[#5B6B7F]">
                // Sologix Execution Standards
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-display font-bold text-[#0F1A2B] mb-2">
              {orderingSteps[activeStep].title}: {orderingSteps[activeStep].subtitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed">
              {orderingSteps[activeStep].summary}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#5B6B7F]">
              <Shield className="w-4 h-4 text-[#FF7A00]" />
              <span>ISO & DIN Compliant</span>
            </div>

            <a
              href="#contact"
              className="px-5 py-2.5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,122,0,0.3)]"
            >
              Start Stage 1 (Upload CAD) →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
