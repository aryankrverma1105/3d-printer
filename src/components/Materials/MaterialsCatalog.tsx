import React, { useState } from 'react';
import { MATERIALS, MaterialItem } from '../../data/materials';
import { Info } from 'lucide-react';

interface MaterialsCatalogProps {
  onSelectMaterialForQuote: (materialName: string) => void;
}

export const MaterialsCatalog: React.FC<MaterialsCatalogProps> = ({ onSelectMaterialForQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem>(MATERIALS[0]);

  const categories = ['All', 'Standard', 'Engineering', 'Flexible', 'Composite'];

  const filteredMaterials = selectedCategory === 'All'
    ? MATERIALS
    : MATERIALS.filter((m) => m.category === selectedCategory);

  return (
    <section id="materials" className="relative py-28 bg-[#0A0A0B] border-t border-white/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              <span className="text-xs font-mono text-[#FF7A00] tracking-widest uppercase font-semibold">
                SECTION 04 // POLYMERS & COMPOSITES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
              MATERIALS & CAPABILITIES
            </h2>
          </div>

          {/* Mandatory Business Availability Disclaimer */}
          <div className="flex items-start gap-2.5 max-w-md p-3.5 rounded-sm bg-[#141418] border border-amber-500/20 text-xs font-mono text-zinc-300">
            <Info className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Availability depends on printer configuration and project requirements. Custom engineering filaments can be procured on request.
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-sm text-sm font-mono uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#FF7A00] text-black font-bold shadow-[0_0_12px_rgba(255,122,0,0.3)]'
                  : 'bg-[#121214] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Material List Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredMaterials.map((mat) => {
              const isSelected = activeMaterial.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-sm border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#16161C] border-[#FF7A00] shadow-[0_0_20px_rgba(255,122,0,0.15)]'
                      : 'bg-[#121214] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-200 uppercase font-semibold">
                        {mat.category}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1.5">
                      {mat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-2">
                      {mat.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-300 font-medium">
                      Layer: {mat.recommendedLayerHeight}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FF7A00] hover:underline">
                      Inspect Specs →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Active Material Deep-Dive Specification Sheet */}
          <div className="p-5 sm:p-6 rounded-sm bg-[#121216] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-[#FF7A00] uppercase font-bold">
                <span>ACTIVE SPECIFICATION</span>
                <span>//</span>
                <span>{activeMaterial.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                {activeMaterial.name}
              </h3>
              <p className="text-sm text-zinc-200 font-sans leading-relaxed mb-4">
                {activeMaterial.summary}
              </p>

              {/* Qualitative Property Indicators */}
              <div className="space-y-3.5 mb-5">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300">Thermal Behavior</span>
                    <span className="text-zinc-100 font-semibold">{activeMaterial.thermalResistance}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#FF7A00]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300">Rigidity & Tensile Yield</span>
                    <span className="text-zinc-100 font-semibold">{activeMaterial.rigidityStrength}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-[#FF7A00]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300">Impact Shock Resilience</span>
                    <span className="text-zinc-100 font-semibold">{activeMaterial.impactResistance}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-[#FF7A00]" />
                  </div>
                </div>
              </div>

              {/* Surface Finish & Applications */}
              <div className="pt-3.5 border-t border-white/10 space-y-3">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase font-medium block mb-1">
                    Surface Appearance
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-200">
                    {activeMaterial.surfaceFinish}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase font-medium block mb-1">
                    Recommended Applications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMaterial.bestFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA to select for quote */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onSelectMaterialForQuote(activeMaterial.name)}
                className="w-full py-2.5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(255,122,0,0.3)] transition-all"
              >
                Select {activeMaterial.name} for Quote →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
