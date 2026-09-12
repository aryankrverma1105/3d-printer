import React from 'react';
import { Box, Layers, Clock, ShieldCheck } from 'lucide-react';

interface MetricItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const METRICS: MetricItem[] = [
  {
    id: 'parts',
    value: '100+',
    label: 'Parts Manufactured',
    sublabel: 'Prototypes & serial end-use units',
    icon: Box,
  },
  {
    id: 'materials',
    value: '10+',
    label: 'Engineering Polymers',
    sublabel: 'PLA, PETG, ABS, ASA',
    icon: Layers,
  },
  {
    id: 'turnaround',
    value: '< 48 Hours',
    label: 'Dispatch ',
    sublabel: 'DFM review & instant queueing',
    icon: Clock,
  },
  {
    id: 'tolerance',
    value: '± 1 mm',
    label: 'Repeatable Precision',
    sublabel: 'Calibrated optical bed leveling',
    icon: ShieldCheck,
  },
];

export const TrustStatsBar: React.FC = () => {
  return (
    <section className="relative z-20 border-y border-white/[0.08] bg-[#0D1520] py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className={`flex items-start gap-3.5 ${idx > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-none">
                    {metric.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-1">
                    {metric.label}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 hidden sm:block">
                    {metric.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
