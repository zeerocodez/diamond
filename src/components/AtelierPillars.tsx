import React from 'react';
import { Scissors, Sparkles, Truck, ShieldCheck } from 'lucide-react';

export const AtelierPillars: React.FC = () => {
  return (
    <section className="bg-[#FAF9F5] dark:bg-[#041812] border-b border-[#E7E2D5] dark:border-[#164132] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A059] dark:text-[#E5C378] font-semibold mb-2">
            The Standard of Distinction
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-[#FAF9F6] font-normal">
            Crafted for the Boardrooms of Lagos & Beyond
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-6 bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-sm bg-[#064E3B]/10 dark:bg-[#10B981]/20 flex items-center justify-center text-[#064E3B] dark:text-[#34D399]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-[#FAF9F6]">
              01. Bespoke Precision
            </h3>
            <p className="text-sm text-stone-600 dark:text-[#A7C4B8] leading-relaxed">
              Every seam, dart, and shoulder pad is calibrated for African female executive proportions, ensuring effortless posture and immaculate comfort.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-sm bg-[#C5A059]/15 dark:bg-[#E5C378]/20 flex items-center justify-center text-[#9B7D3B] dark:text-[#F3E5AB]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-[#FAF9F6]">
              02. World-Class Textiles
            </h3>
            <p className="text-sm text-stone-600 dark:text-[#A7C4B8] leading-relaxed">
              Imported Super 130s Italian wools, Japanese architectural crepe, and 22-momme pure mulberry silk that drape flawlessly under high humidity.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-sm bg-[#064E3B]/10 dark:bg-[#10B981]/20 flex items-center justify-center text-[#064E3B] dark:text-[#34D399]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-[#FAF9F6]">
              03. White-Glove Dispatch
            </h3>
            <p className="text-sm text-stone-600 dark:text-[#A7C4B8] leading-relaxed">
              Dedicated concierge courier across Victoria Island, Ikoyi, Lekki Phase 1, and Ikeja GRA. Delivered hung in signature breathable garment carriers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-sm bg-[#C5A059]/15 dark:bg-[#E5C378]/20 flex items-center justify-center text-[#9B7D3B] dark:text-[#F3E5AB]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-[#FAF9F6]">
              04. Executive Fit Guarantee
            </h3>
            <p className="text-sm text-stone-600 dark:text-[#A7C4B8] leading-relaxed">
              Complimentary alteration adjustments by our Master Tailor at our Victoria Island Atelier within 14 days of receiving your order.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
