import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-2xl rounded-sm border border-[#E7E2D5] shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#064E3B] font-semibold mb-2">
          <Ruler className="w-4 h-4 text-[#C5A059]" />
          <span>Serena Diamond Bespoke Atelier</span>
        </div>

        <h3 className="font-serif text-2xl text-stone-900 font-medium mb-3">
          Executive Size Chart & Measurement Guide
        </h3>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Our ready-to-wear corporate cuts are precision-engineered for African executive female silhouettes, incorporating waist contouring and hip ease. All measurements are in inches (with cm conversions).
        </p>

        {/* Size Table */}
        <div className="overflow-x-auto border border-[#E7E2D5] rounded-xs bg-white mb-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#064E3B] text-[#F3E5AB] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">UK / NG</th>
                <th className="py-3 px-4">Bust (in)</th>
                <th className="py-3 px-4">Waist (in)</th>
                <th className="py-3 px-4">Hips (in)</th>
                <th className="py-3 px-4">Blazer Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-800">
              <tr>
                <td className="py-3 px-4 font-bold text-[#064E3B]">XS</td>
                <td className="py-3 px-4">UK 6 - 8</td>
                <td className="py-3 px-4">32" - 33" (83cm)</td>
                <td className="py-3 px-4">25" - 26" (64cm)</td>
                <td className="py-3 px-4">35" - 36" (90cm)</td>
                <td className="py-3 px-4">26.5"</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="py-3 px-4 font-bold text-[#064E3B]">S</td>
                <td className="py-3 px-4">UK 10</td>
                <td className="py-3 px-4">34" - 35" (88cm)</td>
                <td className="py-3 px-4">27" - 28" (70cm)</td>
                <td className="py-3 px-4">37" - 38" (95cm)</td>
                <td className="py-3 px-4">27.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#064E3B]">M</td>
                <td className="py-3 px-4">UK 12</td>
                <td className="py-3 px-4">36" - 37" (93cm)</td>
                <td className="py-3 px-4">29" - 30" (75cm)</td>
                <td className="py-3 px-4">39" - 41" (102cm)</td>
                <td className="py-3 px-4">27.5"</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="py-3 px-4 font-bold text-[#064E3B]">L</td>
                <td className="py-3 px-4">UK 14</td>
                <td className="py-3 px-4">38" - 40" (99cm)</td>
                <td className="py-3 px-4">31" - 33" (82cm)</td>
                <td className="py-3 px-4">42" - 44" (110cm)</td>
                <td className="py-3 px-4">28.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#064E3B]">XL</td>
                <td className="py-3 px-4">UK 16 - 18</td>
                <td className="py-3 px-4">41" - 43" (106cm)</td>
                <td className="py-3 px-4">34" - 36" (89cm)</td>
                <td className="py-3 px-4">45" - 47" (118cm)</td>
                <td className="py-3 px-4">28.5"</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="py-3 px-4 font-bold text-[#064E3B]">1X</td>
                <td className="py-3 px-4">UK 20</td>
                <td className="py-3 px-4">44" - 46" (114cm)</td>
                <td className="py-3 px-4">37" - 39" (96cm)</td>
                <td className="py-3 px-4">48" - 50" (124cm)</td>
                <td className="py-3 px-4">29.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#064E3B]">2X</td>
                <td className="py-3 px-4">UK 22 - 24</td>
                <td className="py-3 px-4">47" - 49" (122cm)</td>
                <td className="py-3 px-4">40" - 43" (105cm)</td>
                <td className="py-3 px-4">51" - 54" (133cm)</td>
                <td className="py-3 px-4">29.5"</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="py-3 px-4 font-bold text-[#064E3B]">3X</td>
                <td className="py-3 px-4">UK 26</td>
                <td className="py-3 px-4">50" - 53" (131cm)</td>
                <td className="py-3 px-4">44" - 47" (115cm)</td>
                <td className="py-3 px-4">55" - 58" (143cm)</td>
                <td className="py-3 px-4">30.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#064E3B]">4X</td>
                <td className="py-3 px-4">UK 28 - 30</td>
                <td className="py-3 px-4">54" - 57" (141cm)</td>
                <td className="py-3 px-4">48" - 51" (125cm)</td>
                <td className="py-3 px-4">59" - 62" (153cm)</td>
                <td className="py-3 px-4">30.5"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-stone-200 rounded text-xs text-stone-600 space-y-1">
          <p className="font-semibold text-stone-900">Between sizes?</p>
          <p>
            For tailored suits, we recommend sizing up to your larger measurement (e.g., hip or bust). Our Victoria Island atelier offers 1 complimentary custom fitting adjustment for every purchase.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#04241B]"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
