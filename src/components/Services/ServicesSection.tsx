import React from 'react';
import { Layers, Box, Cpu, Repeat, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'rapid-prototyping',
      title: 'Rapid Prototyping',
      tagline: 'From Concept to Handheld Model',
      description:
        'Quickly transform digital CAD concepts into high-fidelity physical prototypes for form, fit, and ergonomic validation with fast turnaround times.',
      icon: Box,
      metric: 'Fast Turnaround', // PLACEHOLDER — confirm with business before launch: turnaround SLA
      features: ['High-resolution dimensional accuracy', 'Multi-material form validation', 'Same-week review cycles'],
    },
    {
      id: 'custom-3d-printing',
      title: 'Custom 3D Printing',
      tagline: 'Tailored Additive Solutions',
      description:
        'Produce bespoke physical components manufactured exactly to your mechanical geometry and chemical/environmental exposure demands.',
      icon: Cpu,
      metric: 'Custom Geometry',
      features: ['Thin-wall and complex internal channels', 'Zero draft-angle tooling limits', 'Multi-polymer compatibility'],
    },
    {
      id: 'product-development',
      title: 'Product Development',
      tagline: 'Iterative Physical Engineering',
      description:
        'Iterate, stress-test, and refine real-world parts. Rapidly test revisions between physical test bench runs to accelerate time to market.',
      icon: Repeat,
      metric: 'Continuous Iteration',
      features: ['Assembly fit-check & snap-fit tuning', 'Thermal & impact behavior testing', 'Pre-production validation'],
    },
    {
      id: 'small-batch',
      title: 'Small-Batch Manufacturing',
      tagline: 'Bridge Production on Demand',
      description:
        'Produce short-run quantities without the prohibitive upfront expense or multi-month lead times of traditional injection steel tooling.',
      icon: Layers,
      metric: 'Zero Tooling Delay',
      features: ['Cost-effective for 10–500+ unit runs', 'On-demand production scheduling', 'Mid-run design updates possible'],
    },
  ];

  return (
    <section id="services" className="relative py-28 bg-[#0A0A0B] border-t border-white/5">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                SECTION 02 // CAPABILITIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
              FROM DIGITAL TO PHYSICAL
            </h2>
          </div>
          <p className="max-w-md text-zinc-300 text-base font-sans leading-relaxed">
            Engineered additive manufacturing built for engineers, industrial designers, and founders who demand speed, consistency, and structural fidelity.
          </p>
        </div>

        {/* 4-Card Industrial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-5 sm:p-6 rounded-sm bg-[#121214] border border-white/10 hover:border-[#FF7A00]/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,122,0,0.12)] flex flex-col justify-between"
              >
                {/* Top card metadata */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm bg-[#1A1A1E] border border-white/10 flex items-center justify-center text-[#FF7A00] group-hover:border-[#FF7A00]/50 group-hover:bg-[#FF7A00]/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-[#FF7A00] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className="text-xs font-mono tracking-wider text-[#FF7A00] uppercase font-bold">
                    {service.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-base text-zinc-200 font-sans leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                {/* Card Features & Action */}
                <div className="pt-4 border-t border-white/10">
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-sm text-zinc-100 font-sans font-medium">
                        <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-sm bg-[#1A1A1E] hover:bg-[#FF7A00] text-zinc-200 hover:text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200"
                  >
                    <span>Consult on {service.title}</span>
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
