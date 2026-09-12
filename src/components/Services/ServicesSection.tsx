import React from 'react';
import { Layers, Box, Cpu, Repeat, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const services = [
    {
      id: 'rapid-prototyping',
      title: 'Rapid Prototyping',
      tagline: 'Concept to Handheld Unit',
      description:
        'Transform complex CAD geometries into structural physical models for tactile ergonomics, packaging fit-checks, and assembly trials in as fast as 24 hours.',
      icon: Box,
      metric: '<24h Dispatch',
      features: [
        'High-resolution dimensional accuracy (±0.1mm)',
        'Iterative form & packaging fit-check validation',
        'Same-day queueing & DFM engineering feedback',
      ],
    },
    {
      id: 'custom-3d-printing',
      title: 'Custom 3D Printing',
      tagline: 'Bespoke Production Geometry',
      description:
        'Produce highly tailored physical components manufactured to strict mechanical, chemical, and thermal exposure operating limits with zero tooling barriers.',
      icon: Cpu,
      metric: 'Zero Tooling Cost',
      features: [
        'Internal conformal channels & complex overhangs',
        'Zero draft-angle limitations of injection molds',
        'Multi-polymer & composite continuous reinforcement',
      ],
    },
    {
      id: 'product-development',
      title: 'Product Development',
      tagline: 'Iterative Physical Engineering',
      description:
        'Stress-test, iterate, and refine real-world parts. Rapidly validate revisions between physical test bench runs to accelerate time to market.',
      icon: Repeat,
      metric: 'Continuous Iteration',
      features: [
        'Rigid assembly fit-check & snap-fit tuning',
        'Thermal, chemical & mechanical behavior testing',
        'Functional pre-production pilot validation',
      ],
    },
    {
      id: 'small-batch',
      title: 'Small-Batch Manufacturing',
      tagline: 'On-Demand Bridge Production',
      description:
        'Fulfill low-to-medium volume orders from 10 to 1,000+ units without waiting months for expensive steel tooling or risking costly inventory surplus.',
      icon: Layers,
      metric: '10–1,000+ Units',
      features: [
        'Cost-effective production without hard tooling',
        'Serial batch serialization & traceability',
        'Agile mid-run revisions and engineering updates',
      ],
    },
  ];

  return (
    <section id="services" ref={ref} className="relative py-20 bg-[#F5F8FC] text-[#1F2937] border-t border-slate-200/60">
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
              <span>01 // SERVICES & CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
              FROM DIGITAL TO PHYSICAL
            </h2>
          </div>
          <p className="max-w-md text-[#5B6B7F] text-xs sm:text-sm font-sans leading-relaxed">
            Engineered additive manufacturing built for hardware teams, industrial designers, and founders who demand speed, consistency, and structural fidelity.
          </p>
        </div>

        {/* 4-Card Industrial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`group relative p-5 sm:p-6 rounded-sm bg-white shadow-[0_2px_12px_rgba(15,26,43,0.06)] hover:shadow-[0_8px_24px_rgba(15,26,43,0.12)] flex flex-col justify-between transition-all duration-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Top card metadata */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    {/* Circular Icon Badge */}
                    <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] group-hover:scale-105 group-hover:bg-[#FF7A00]/20 transition-all duration-200">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#2E90D9]/10 text-[#2E90D9] border border-[#2E90D9]/30">
                      {service.metric}
                    </span>
                  </div>

                  <span className="text-xs font-mono tracking-wider text-[#FF7A00] uppercase font-bold">
                    {service.tagline}
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-[#0F1A2B] mt-1 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>

                {/* Card Features with CheckCircle2 & Action */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="space-y-2 mb-5">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2937] font-sans">
                        <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-sm bg-[#0D1520] hover:bg-[#FF7A00] text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(255,122,0,0.3)]"
                  >
                    <span>Configure {service.title}</span>
                    <ArrowUpRight className="w-4 h-4" />
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
