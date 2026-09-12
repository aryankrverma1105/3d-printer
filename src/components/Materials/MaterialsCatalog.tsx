import React, { useState } from 'react';
import { MATERIALS, MaterialItem } from '../../data/materials';
import { Info, ArrowRight, Check } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface MaterialsCatalogProps {
  onSelectMaterialForQuote: (materialName: string) => void;
}

export const MaterialsCatalog: React.FC<MaterialsCatalogProps> = ({ onSelectMaterialForQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem>(MATERIALS[0]);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const categories = ['All', 'Standard', 'Engineering', 'Flexible', 'Composite'];

  const filteredMaterials = selectedCategory === 'All'
    ? MATERIALS
    : MATERIALS.filter((m) => m.category === selectedCategory);

  return (
    <section id="materials" ref={ref} className="relative py-20 bg-[#F5F8FC] text-[#1F2937] border-t border-slate-200/60">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-xs uppercase tracking-widest font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              <span>03 // POLYMERS & COMPOSITES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
              MATERIALS & SPECS
            </h2>
          </div>

          {/* Mandatory Business Availability Disclaimer */}
          <div className="flex items-start gap-3 max-w-md p-4 rounded-sm bg-white shadow-[0_2px_10px_rgba(15,26,43,0.05)] text-xs font-mono text-[#5B6B7F]">
            <Info className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-[#0F1A2B]">Note:</strong> Stock depends on chamber configuration and project specs. Specialized engineering filaments can be procured within 24h.
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-sm text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#FF7A00] text-black font-bold shadow-[0_0_15px_rgba(255,122,0,0.35)]'
                  : 'bg-white text-[#1F2937] hover:text-[#0F1A2B] shadow-[0_2px_8px_rgba(15,26,43,0.06)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Material List Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => {
              const isSelected = activeMaterial.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat)}
                  className={`cursor-pointer p-5 sm:p-6 rounded-sm transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-50/50 border-2 border-[#FF7A00] shadow-[0_4px_24px_rgba(255,122,0,0.12)] translate-y-[-2px]'
                      : 'bg-white shadow-[0_2px_12px_rgba(15,26,43,0.06)] hover:shadow-[0_8px_24px_rgba(15,26,43,0.12)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#2E90D9]/10 border border-[#2E90D9]/30 text-[#2E90D9] uppercase font-semibold">
                        {mat.category}
                      </span>
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[#FF7A00] text-xs font-mono font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </div>
                      ) : null}
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-[#0F1A2B] mb-2">
                      {mat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed line-clamp-2">
                      {mat.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5B6B7F]">
                      Layer: <span className="text-[#1F2937] font-semibold">{mat.recommendedLayerHeight}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FF7A00] flex items-center gap-1 group-hover:underline">
                      Inspect Specs <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Active Material Deep-Dive Specification Sheet */}
          <div className="p-6 sm:p-8 rounded-sm bg-white shadow-[0_4px_24px_rgba(15,26,43,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#FF7A00] uppercase font-bold tracking-wider">
                <span>ACTIVE SPECIFICATION</span>
                <span>//</span>
                <span>{activeMaterial.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0F1A2B] mb-3">
                {activeMaterial.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed mb-6">
                {activeMaterial.summary}
              </p>

              {/* Qualitative Property Indicators */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#5B6B7F]">Thermal Resistance</span>
                    <span className="text-[#0F1A2B] font-semibold">{activeMaterial.thermalResistance}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#FF7A00]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#5B6B7F]">Rigidity & Tensile Yield</span>
                    <span className="text-[#0F1A2B] font-semibold">{activeMaterial.rigidityStrength}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-[#FF7A00]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#5B6B7F]">Impact Shock Resilience</span>
                    <span className="text-[#0F1A2B] font-semibold">{activeMaterial.impactResistance}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-[#FF7A00]" />
                  </div>
                </div>
              </div>

              {/* Surface Finish & Applications */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#5B6B7F] uppercase font-medium block mb-1">
                    Surface Appearance
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-[#1F2937]">
                    {activeMaterial.surfaceFinish}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#5B6B7F] uppercase font-medium block mb-1.5">
                    Recommended Applications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMaterial.bestFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#2E90D9]/10 border border-[#2E90D9]/30 text-xs font-mono text-[#2E90D9]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA to select for quote */}
            <div className="mt-8 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectMaterialForQuote(activeMaterial.name)}
                className="w-full py-3 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,122,0,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <span>Select {activeMaterial.name} for Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
