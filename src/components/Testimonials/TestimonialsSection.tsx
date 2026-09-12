import React, { useState } from 'react';
import { Star, Quote, ShieldCheck, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  state: string;
  rating: number;
  avatar: string;
  headline: string;
  content: string;
  partManufactured: string;
  material: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Krishnan',
    role: 'Head of Mechanical Engineering',
    company: 'NexVolt Mobility',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    avatar: 'RK',
    headline: 'Dispatched 40 snap-fit battery brackets in under 24 hours',
    content:
      'We had a critical validation trial for our Gen-2 electric scooter battery pack. Traditional CNC tooling was quoting 3 weeks. Sologix Energy reviewed our STEP files at 9 AM and had all 40 PA-CF composite brackets delivered to our Whitefield facility the next afternoon. Dimensional tolerance was within ±0.08mm.',
    partManufactured: 'High-Voltage Battery Mounting Brackets',
    material: 'PA-CF (Carbon Nylon)',
  },
  {
    id: '2',
    name: 'Dr. Pooja Deshmukh',
    role: 'Principal R&D Scientist',
    company: 'Biomech Innovations',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    avatar: 'PD',
    headline: 'Flawless surface finish and biocompatible form validation',
    content:
      'The optical accuracy and absence of layer scar marks on our surgical drill guide prototypes were remarkable. Their team suggested subtle draft angle compensations during DFM review that saved us two complete tooling iterations. Highly recommend for precision healthcare hardware.',
    partManufactured: 'Ergonomic Surgical Handpiece Enclosures',
    material: 'Medical PETG',
  },
  {
    id: '3',
    name: 'Vikramaditya Nair',
    role: 'Aerospace Systems Lead',
    company: 'Skylark Dynamics Lab',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 5,
    avatar: 'VN',
    headline: 'Strict NDA compliance with aerospace weight-reduction lattices',
    content:
      'As a defense and UAV startup, data confidentiality and strength-to-weight ratios are paramount. Sologix signed our bilateral NDA within 30 minutes. The gyroid infill density in our carbon-reinforced drone motor mounts gave us 35% mass reduction while passing 8G vibration testing.',
    partManufactured: 'UAV Octocopter Motor Arms & Cowlings',
    material: 'PETG-CF / Carbon Fiber',
  },
  {
    id: '4',
    name: 'Arjun Singhania',
    role: 'Chief Industrial Designer',
    company: 'Aura Consumer Tech',
    city: 'Gurugram',
    state: 'Delhi NCR',
    rating: 5,
    avatar: 'AS',
    headline: 'Feels like an in-house rapid prototyping laboratory',
    content:
      'The speed of iteration has completely changed our product roadmap. We iterated through 6 mechanical enclosure designs in 10 days. The brass threaded heat-set inserts were installed perfectly straight without any plastic flash. A game changer for Indian hardware founders.',
    partManufactured: 'Smart IoT Home Gateway Enclosures',
    material: 'High-Impact ABS',
  },
  {
    id: '5',
    name: 'Ananya Sen',
    role: 'Manufacturing Operations Lead',
    company: 'Titanium Auto Solutions',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    avatar: 'AS',
    headline: 'Repeatable tolerance on 150-unit bridge production run',
    content:
      'We needed 150 assembly fixtures for our Oragadam automotive assembly line before our main injection mold arrived from Germany. Sologix ran the entire batch with zero variance across all units. Go/No-Go gauge testing showed 100% yield.',
    partManufactured: 'Shop-Floor Robotic Sensor Calibration Jigs',
    material: 'PLA Tough / Industrial',
  },
];

export const TestimonialsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.01, rootMargin: '200px 0px 0px 0px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative py-20 bg-[#D6E6F5] text-[#1F2937] border-t border-[#C9DBEC] overflow-hidden"
    >
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
              <span>05 // VERIFIED CLIENT SUCCESS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#0F1A2B] tracking-tight uppercase">
              TRUSTED BY HARDWARE TEAMS ACROSS INDIA
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Verified Production Reviews</span>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevTestimonial}
                className="w-9 h-9 rounded-sm bg-white hover:bg-[#FF7A00] text-[#0F1A2B] hover:text-black border border-[#C9DBEC] flex items-center justify-center transition-colors shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                className="w-9 h-9 rounded-sm bg-white hover:bg-[#FF7A00] text-[#0F1A2B] hover:text-black border border-[#C9DBEC] flex items-center justify-center transition-colors shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => {
            const isFeatured = idx === currentIndex;
            return (
              <div
                key={t.id}
                style={{ transitionDelay: `${idx * 70}ms` }}
                className={`relative p-5 sm:p-6 rounded-sm flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-white border-2 border-[#FF7A00] shadow-[0_8px_30px_rgba(255,122,0,0.14)] -translate-y-1'
                    : 'bg-white border border-[#C9DBEC] shadow-[0_4px_20px_rgba(15,26,43,0.04)] hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Quote & Rating Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#FF7A00]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FF7A00]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-slate-300 shrink-0" />
                  </div>

                  {/* Review Headline */}
                  <h3 className="text-base font-display font-bold text-[#0F1A2B] mb-2.5 leading-snug">
                    “{t.headline}”
                  </h3>

                  {/* Review Body */}
                  <p className="text-xs sm:text-sm text-[#5B6B7F] font-sans leading-relaxed mb-5">
                    {t.content}
                  </p>
                </div>

                {/* Part & Material Details Badge */}
                <div className="pt-4 border-t border-[#C9DBEC]/60">
                  <div className="p-2.5 rounded bg-[#F5F8FC] border border-[#C9DBEC] mb-4 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-[#5B6B7F]">
                      <span>Part:</span>
                      <span className="text-[#1F2937] font-medium truncate max-w-[170px]">{t.partManufactured}</span>
                    </div>
                    <div className="flex justify-between text-[#5B6B7F]">
                      <span>Material:</span>
                      <span className="text-[#FF7A00] font-medium">{t.material}</span>
                    </div>
                  </div>

                  {/* Author Profile */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-[#FF7A00]/40 flex items-center justify-center font-mono font-bold text-xs text-[#FF7A00] shrink-0">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0F1A2B] truncate">
                        {t.name}
                      </div>
                      <div className="text-xs text-[#5B6B7F] truncate flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-[#FF7A00] shrink-0" />
                        <span>{t.company}</span>
                      </div>
                      <div className="text-[11px] text-[#5B6B7F] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{t.city}, {t.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indian Metro Delivery Footnote */}
        <div className="mt-8 pt-6 border-t border-[#C9DBEC] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5B6B7F]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Serving hardware teams across Bengaluru, Pune, Hyderabad, Delhi NCR, Mumbai & Chennai</span>
          </div>
          <div className="text-[#5B6B7F]">
            Same-day dispatch via express cargo air freight
          </div>
        </div>
      </div>
    </section>
  );
};
