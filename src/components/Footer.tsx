import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  onOpenFitting: () => void;
  onOpenSizeGuide: () => void;
  onOpenEnvModal: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFitting,
  onOpenSizeGuide,
  onOpenEnvModal,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#04241B] dark:bg-[#02140D] text-stone-300 border-t border-[#06392B] dark:border-[#10B981]/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.14em] uppercase text-[#F3E5AB] font-semibold block">
                Serena Diamond
              </span>
              <span className="text-[10px] tracking-[0.32em] uppercase text-[#C5A059] font-medium block mt-0.5">
                Bespoke Atelier &bull; Lagos
              </span>
            </div>
            
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Ready-to-wear corporate attire and bespoke executive wear for women in leadership. Handcrafted in our Victoria Island atelier using world-class Italian worsted wools, Japanese crepe, and pure mulberry silks.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>14A Walter Carrington Crescent, Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Concierge & WhatsApp: +234 (0) 809 555 4321</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>concierge@serenadiamondbespoke.com</span>
              </div>
            </div>
          </div>

          {/* Nav: Ready to Wear */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
              The Collections
            </h4>
            <ul className="text-xs space-y-2 text-stone-300">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('African Heritage Tailoring');
                    window.scrollTo({ top: 720, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  African Heritage Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Curated Plus & Silhouette');
                    window.scrollTo({ top: 720, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curated Plus & Silhouette
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Tailored Blazers');
                    window.scrollTo({ top: 720, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Double-Breasted Blazers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Sheath Dresses');
                    window.scrollTo({ top: 720, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Executive Sheath Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Power Suits');
                    window.scrollTo({ top: 720, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Three-Piece Power Suits
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
              Atelier Services
            </h4>
            <ul className="text-xs space-y-2 text-stone-300">
              <li>
                <button
                  onClick={onOpenFitting}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Book Private Victoria Island Fitting
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  African Executive Size Guide
                </button>
              </li>
              <li>
                <span className="text-stone-400">14-Day Free Fitting Adjustments</span>
              </li>
              <li>
                <span className="text-stone-400">Ikoyi & VI White-Glove Courier</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
              Architecture
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              PostgreSQL (Supabase/Neon), Google OAuth 2.0, Mailgun Transactional Email Engine, and Nigerian Naira (₦) payments.
            </p>
            <button
              onClick={onOpenEnvModal}
              className="mt-2 px-3 py-1.5 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#F3E5AB] text-[11px] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspect .env & DB Schema</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#06392B] dark:border-[#10B981]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Serena Diamond Bespoke. Victoria Island, Lagos, Nigeria. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span>Currency: ₦ Nigerian Naira (NGN)</span>
            <span>Atelier Privacy & Terms</span>
            <ThemeToggle />
          </div>
        </div>

      </div>
    </footer>
  );
};
