import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/auth';

interface BespokeFittingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BespokeFittingModal: React.FC<BespokeFittingModalProps> = ({ isOpen, onClose }) => {
  const currentUser = authService.getCurrentUser();
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+234 803 555 4321');
  const [fittingType, setFittingType] = useState('Boardroom Power Suit & Blazer');
  const [preferredDate, setPreferredDate] = useState('2026-10-05');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [locationPreference, setLocationPreference] = useState('Victoria Island Atelier Private Suite');
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      // auto close after notice
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-xl rounded-sm border border-[#E7E2D5] shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-widest text-[#064E3B] font-bold">
              Appointment Reserved
            </div>
            <h3 className="font-serif text-2xl text-stone-900 font-medium">
              We Await You at Our Victoria Island Atelier
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Our Master Tailor has reserved your private executive suite on <strong>{preferredDate} at {preferredTime}</strong> at 14A Walter Carrington Crescent, Victoria Island, Lagos. A calendar invitation and concierge phone briefing have been routed to <strong>{email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#04241B]"
            >
              Return to Collection
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center space-y-1 mb-6">
              <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
                Private Showroom &bull; Victoria Island, Lagos
              </div>
              <h3 className="font-serif text-2xl text-stone-900 font-medium">
                Reserve an Atelier Bespoke Fitting
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Enjoy champagne, private styling consultation, and 30 precision anatomical measurements with our Master Tailor.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Executive Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="e.g. Chief Zainab Balogun"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="director@firm.ng"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Focus Commission
                  </label>
                  <select
                    value={fittingType}
                    onChange={(e) => setFittingType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none cursor-pointer"
                  >
                    <option value="Boardroom Power Suit & Blazer">Boardroom Power Suit & Blazer</option>
                    <option value="Executive Sheath & Cape Gown">Executive Sheath & Cape Gown</option>
                    <option value="Complete Executive Capsule (5 pieces)">Complete Executive Capsule (5 pieces)</option>
                    <option value="Complimentary Ready-to-Wear Adjustment">Complimentary Ready-to-Wear Adjustment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Preferred Session Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM (Morning VIP Slot)</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM (Afternoon Executive Slot)</option>
                    <option value="05:00 PM">05:00 PM (Sunset Fitting & Drinks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Venue Preference
                </label>
                <select
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none cursor-pointer"
                >
                  <option value="Victoria Island Atelier Private Suite">
                    Serena Diamond Atelier (14A Walter Carrington, Victoria Island)
                  </option>
                  <option value="Executive Office Call-Out (Ikoyi / VI / Lekki)">
                    Private Corporate Office Call-Out (Ikoyi / Victoria Island)
                  </option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors cursor-pointer shadow-sm"
                >
                  Confirm Atelier Fitting Reservation
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
