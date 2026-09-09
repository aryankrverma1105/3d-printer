import { useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollPrinterHero } from './components/Hero/ScrollPrinterHero';
import { ServicesSection } from './components/Services/ServicesSection';
import { ProcessWorkflow } from './components/Process/ProcessWorkflow';
import { MaterialsCatalog } from './components/Materials/MaterialsCatalog';
import { ApplicationsGrid } from './components/Applications/ApplicationsGrid';
import { EditorialSection } from './components/WhySologix/EditorialSection';
import { ProjectIntakeForm } from './components/Intake/ProjectIntakeForm';
import { Footer } from './components/Footer';

// Lazy-loaded Three.js 3D Preview section (zero initial bundle weight)
const ModelPreview3D = lazy(() => import('./components/Showcase3D/ModelPreview3D'));

export default function App() {
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState('Rapid Prototyping');
  const [selectedMaterialForQuote, setSelectedMaterialForQuote] = useState('PLA / PLA Carbon Fiber');

  const scrollToQuote = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedServiceForQuote(serviceName);
    scrollToQuote();
  };

  const handleSelectMaterial = (materialName: string) => {
    setSelectedMaterialForQuote(materialName);
    scrollToQuote();
  };

  const handleSelectApplication = (appTitle: string) => {
    setSelectedServiceForQuote(`Application: ${appTitle}`);
    scrollToQuote();
  };

  const handleSelectModel = (modelName: string, material: string) => {
    setSelectedServiceForQuote(`Model: ${modelName}`);
    setSelectedMaterialForQuote(material);
    scrollToQuote();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0EDEE] flex flex-col selection:bg-[#FF7A00] selection:text-black font-sans">
      {/* Floating Navbar */}
      <Navbar onOpenQuote={scrollToQuote} />

      <main className="flex-grow">
        {/* Main Cinematic Scroll-Controlled Hero */}
        <ScrollPrinterHero
          onStartProject={scrollToQuote}
          onExploreServices={scrollToServices}
        />

        {/* Section 02: What We Do */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* Section 03: The Process */}
        <ProcessWorkflow />

        {/* Section 04: Materials & Capabilities */}
        <MaterialsCatalog onSelectMaterialForQuote={handleSelectMaterial} />

        {/* Section 05: Interactive 3D Model Preview (Capability Demonstrations) */}
        <Suspense
          fallback={
            <div className="py-24 bg-[#0A0A0B] text-center text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Initializing 3D WebGL Canvas...
            </div>
          }
        >
          <ModelPreview3D onSelectModelForQuote={handleSelectModel} />
        </Suspense>

        {/* Section 06: Engineered Applications */}
        <ApplicationsGrid onSelectApplication={handleSelectApplication} />

        {/* Section 07: Why Sologix Energy */}
        <EditorialSection />

        {/* Section 08: Simplified Project Intake & Quote Form */}
        <ProjectIntakeForm
          initialService={selectedServiceForQuote}
          initialMaterial={selectedMaterialForQuote}
        />
      </main>

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
}
