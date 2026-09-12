import React, { useState } from 'react';
import { ChevronDown, HelpCircle, FileText, Clock, Shield, Sparkles, Truck, IndianRupee } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'How fast will I receive an engineering quotation after uploading my CAD file?',
    answer:
      'Our team evaluates 3D CAD files within 30 to 60 minutes during business hours. We review your geometry for wall thickness, overhang angles, structural orientation, and optimal polymer selection before generating a formal quote with estimated dispatch times.',
    category: 'Quotation',
    icon: Clock,
  },
  {
    id: '2',
    question: 'Which CAD / 3D model formats do you accept?',
    answer:
      'We accept .STL, .STEP, .STP, .OBJ, and .3MF files directly through our upload form. For multi-part assemblies, we recommend STEP/STP as it retains precise curved parametric surfaces rather than triangulated polygon meshes.',
    category: 'File Formats',
    icon: FileText,
  },
  {
    id: '3',
    question: 'What is your delivery timeline across major Indian cities?',
    answer:
      'Most rapid prototypes and low-volume batches are dispatched within 24 hours from print completion. We partner with priority air logistics providers to deliver within 1–2 business days across Bengaluru, Mumbai, Pune, Delhi NCR, Hyderabad, Chennai, and Ahmedabad.',
    category: 'Delivery',
    icon: Truck,
  },
  {
    id: '4',
    question: 'What dimensional tolerance and accuracy can Sologix achieve?',
    answer:
      'Our fleet operates with calibrated dual-sensor optical bed leveling and active vibration compensation, maintaining ±0.1 mm repeatable dimensional tolerance. We can dial in adaptive layer heights down to 0.08 mm for micro-detail assemblies and snap-fit joints.',
    category: 'Quality',
    icon: Sparkles,
  },
  {
    id: '5',
    question: 'Do you sign Non-Disclosure Agreements (NDAs) for confidential IP?',
    answer:
      'Yes, absolutely. We work extensively with defense, automotive, aerospace, and medical tech startups. We can sign your company NDA or provide our standard mutual confidentiality agreement prior to file review. All files are hosted on private, encrypted storage.',
    category: 'Security',
    icon: Shield,
  },
  {
    id: '6',
    question: 'Do you provide GST invoices for corporate input tax credit (ITC)?',
    answer:
      'Yes. All quotations and orders include official GST-compliant tax invoices containing your company name and GSTIN so your accounting team can claim full Input Tax Credit (ITC).',
    category: 'Billing',
    icon: IndianRupee,
  },
];

export const FAQSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [openId, setOpenId] = useState<string>('1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="faq"
      ref={ref}
      className="relative py-20 bg-[#0D1520] border-t border-white/[0.08]"
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-xs uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>06 // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight uppercase">
            EVERYTHING YOU NEED TO KNOW
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Clear answers about file requirements, Indian delivery logistics, precision tolerances, and enterprise NDAs.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;
            return (
              <div
                key={faq.id}
                style={{ transitionDelay: `${idx * 50}ms` }}
                className={`rounded-sm transition-all duration-200 border ${
                  isOpen
                    ? 'bg-[#16233A] border-[#FF7A00]/50 shadow-[0_0_20px_rgba(255,122,0,0.08)]'
                    : 'bg-[#16233A] border-white/[0.08] hover:border-[#2E90D9]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border transition-colors ${
                        isOpen
                          ? 'bg-[#FF7A00]/15 border-[#FF7A00] text-[#FF7A00]'
                          : 'bg-white/5 border-white/[0.08] text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-display font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF7A00]' : 'text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed pl-16 pr-6 animate-fade-in border-t border-white/[0.08] mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Desk Box */}
        <div className="mt-10 p-5 rounded-sm bg-[#16233A] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm font-display font-bold text-white">
              Have a specific material or tolerance requirement?
            </div>
            <div className="text-xs text-zinc-400 font-sans mt-0.5">
              Talk directly with our additive manufacturing application engineers.
            </div>
          </div>

          <a
            href="#contact"
            className="px-5 py-2 rounded-sm bg-[#FF7A00] hover:bg-[#FF8F1F] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,122,0,0.3)] shrink-0"
          >
            Upload CAD for Review →
          </a>
        </div>
      </div>
    </section>
  );
};
