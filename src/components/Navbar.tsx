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
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQs', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-1 sm:py-1.5 bg-[#0D1520]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg'
            : 'py-2.5 sm:py-3 bg-gradient-to-b from-[#0D1520]/95 via-[#0D1520]/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div
                className={`rounded-sm bg-[#16233A] border border-[#FF7A00]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#FF7A00] group-hover:shadow-[0_0_10px_rgba(255,122,0,0.35)] ${
                  scrolled ? 'w-6 h-6' : 'w-7 h-7'
                }`}
              >
                <div
                  className={`border-t-2 border-l-2 border-[#FF7A00] rotate-45 transform ${
                    scrolled ? 'w-2.5 h-2.5' : 'w-3 h-3'
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-display font-bold tracking-tight text-white flex items-center gap-1 leading-none transition-all duration-200 ${
                    scrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  }`}
                >
                  SOLOGIX <span className="text-[#FF7A00]">ENERGY</span>
                </span>
                {!scrolled && (
                  <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 hidden sm:block leading-none">
                    Additive Manufacturing
                  </span>
                )}
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav
              className={`hidden md:flex items-center rounded-full bg-[#16233A]/90 border border-white/[0.08] backdrop-blur-md transition-all duration-200 ${
                scrolled ? 'px-2.5 py-0.5 gap-0.5' : 'px-3.5 py-1.5 gap-1 lg:gap-2'
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-sans font-medium text-zinc-200 hover:text-[#FF7A00] transition-colors duration-200 tracking-normal ${
                    scrolled ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs lg:text-sm'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Action CTA */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenQuote}
                className={`flex items-center gap-1.5 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_10px_rgba(255,122,0,0.3)] hover:shadow-[0_0_18px_rgba(255,122,0,0.5)] ${
                  scrolled ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'
                }`}
              >
                <span>Get a Quote</span>
                <ArrowRight className={scrolled ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={onOpenQuote}
                className={`rounded-sm bg-[#FF7A00] text-black font-mono font-bold uppercase ${
                  scrolled ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'
                }`}
              >
                Quote
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`rounded-sm bg-[#16233A] border border-white/[0.08] text-zinc-300 hover:text-white ${
                  scrolled ? 'p-1' : 'p-1.5'
                }`}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className={scrolled ? 'w-4 h-4' : 'w-5 h-5'} />
                ) : (
                  <Menu className={scrolled ? 'w-4 h-4' : 'w-5 h-5'} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#0D1520]/95 backdrop-blur-2xl pt-28 px-6 pb-8 flex flex-col justify-between border-b border-white/[0.08]">
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
