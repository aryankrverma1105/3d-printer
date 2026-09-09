import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Materials', href: '#materials' },
    { label: '3D Preview', href: '#models' },
    { label: 'Why Us', href: '#why-sologix' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#0A0A0B]/90 backdrop-blur-lg border-b border-white/10 shadow-2xl'
            : 'py-6 bg-gradient-to-b from-[#0A0A0B]/90 via-[#0A0A0B]/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-sm bg-[#16161A] border border-[#FF7A00]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#FF7A00] group-hover:shadow-[0_0_15px_rgba(255,122,0,0.35)]">
                <div className="w-4 h-4 border-t-2 border-l-2 border-[#FF7A00] rotate-45 transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-tight text-white text-xl sm:text-2xl flex items-center gap-1.5">
                  SOLOGIX <span className="text-[#FF7A00]">ENERGY</span>
                </span>
                <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase -mt-0.5 hidden sm:block">
                  Additive Manufacturing
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4 px-5 py-2.5 rounded-full bg-[#121214]/85 border border-white/10 backdrop-blur-md">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1 text-base font-sans font-medium text-zinc-200 hover:text-[#FF7A00] transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Action CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenQuote}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_15px_rgba(255,122,0,0.35)] hover:shadow-[0_0_25px_rgba(255,122,0,0.5)]"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-4 py-2 rounded-sm bg-[#FF7A00] text-black font-mono text-xs font-bold uppercase"
              >
                Quote
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-sm bg-[#16161A] border border-white/10 text-zinc-300 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl pt-28 px-6 pb-8 flex flex-col justify-between border-b border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1.5 mb-6 border border-[#FF7A00]/30 bg-[#FF7A00]/10 rounded text-xs font-mono text-[#FF7A00]">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span>ON-DEMAND PRODUCTION FLEET ACTIVE</span>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xl font-display font-bold tracking-tight text-zinc-200 hover:text-[#FF7A00] border-l-2 border-transparent hover:border-[#FF7A00] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-4 rounded-sm bg-[#FF7A00] text-black font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,122,0,0.4)]"
            >
              <span>Request Quote / Start Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
