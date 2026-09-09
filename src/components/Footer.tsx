import { ArrowUp, Mail, Phone, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070708] border-t border-white/10 pt-16 pb-12 text-zinc-400 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#16161A] border border-[#FF7A00]/40 flex items-center justify-center">
                <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF7A00] rotate-45 transform" />
              </div>
              <span className="font-display font-bold tracking-tight text-white text-xl">
                SOLOGIX <span className="text-[#FF7A00]">ENERGY</span>
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm font-sans leading-relaxed">
              Precision additive manufacturing, reimagined. Turning digital CAD geometries into functional prototypes and high-stress physical parts on demand.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PRODUCTION FLEET: 24/7 AUTONOMOUS OPERATION</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold block mb-4">
              SERVICES
            </span>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#services" className="hover:text-[#FF7A00] transition-colors">Rapid Prototyping</a></li>
              <li><a href="#services" className="hover:text-[#FF7A00] transition-colors">Custom 3D Printing</a></li>
              <li><a href="#services" className="hover:text-[#FF7A00] transition-colors">Product Development</a></li>
              <li><a href="#services" className="hover:text-[#FF7A00] transition-colors">Small-Batch Runs</a></li>
            </ul>
          </div>

          {/* Engineering */}
          <div>
            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold block mb-4">
              CAPABILITIES
            </span>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#materials" className="hover:text-[#FF7A00] transition-colors">PLA / Carbon Fiber</a></li>
              <li><a href="#materials" className="hover:text-[#FF7A00] transition-colors">PETG Chemical Grade</a></li>
              <li><a href="#materials" className="hover:text-[#FF7A00] transition-colors">ABS / ASA Automotive</a></li>
              <li><a href="#materials" className="hover:text-[#FF7A00] transition-colors">TPU Flexible Polymers</a></li>
              <li><a href="#materials" className="hover:text-[#FF7A00] transition-colors">PA-CF Structural Nylon</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold block mb-4">
              DIRECT INTAKE
            </span>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                <span className="break-all">projects@sologixenergy.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>+1 (800) SOLOGIX</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>NDA Protected Inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Sologix Energy Inc. All rights reserved. Precision Made Physical.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FF7A00]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
