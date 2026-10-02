import React from 'react';
import { CheckCircle2, Mail, Printer, ArrowRight, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Order } from '../types';
import { formatNGN } from '../services/mailgun';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewEmail: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewEmail,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-3xl rounded-sm border border-[#E7E2D5] shadow-2xl overflow-hidden my-8">
        
        {/* Top Celebration Banner */}
        <div className="bg-[#064E3B] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/20 text-[#F3E5AB] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="text-[11px] uppercase tracking-[0.25em] text-[#F3E5AB] font-semibold mb-1">
            Commission Registered Successfully
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-wide">
            Thank You, {order.customer_name}
          </h2>

          <p className="text-xs text-stone-200 mt-2 max-w-md mx-auto">
            Your executive order reference is <strong className="text-white font-mono">{order.id}</strong>. A confirmation email has been dispatched via our Mailgun transactional engine.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-[#04241B]/60 text-xs px-3 py-1 rounded border border-[#C5A059]/40 text-[#F3E5AB]">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated Lagos Concierge Delivery: 24 - 48 Hours</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Status Timeline */}
          <div className="border border-stone-200 bg-white p-4 rounded-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Garment Progress Lifecycle
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white mx-auto flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div className="font-semibold text-stone-900">Order Placed</div>
                <div className="text-[10px] text-stone-500">Verified</div>
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white mx-auto flex items-center justify-center text-[10px] font-bold">
                  2
                </div>
                <div className="font-semibold text-[#064E3B]">Atelier Review</div>
                <div className="text-[10px] text-stone-500">Master Tailor</div>
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 mx-auto flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <div className="font-semibold text-stone-500">Garment Bagging</div>
                <div className="text-[10px] text-stone-400">Carrier Prep</div>
              </div>
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 mx-auto flex items-center justify-center text-[10px] font-bold">
                  4
                </div>
                <div className="font-semibold text-stone-500">Concierge Delivery</div>
                <div className="text-[10px] text-stone-400">White-Glove</div>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-stone-900 pb-2 border-b border-stone-200 mb-3">
              <span>Commissioned Garments ({order.items.length})</span>
              <span>Amount</span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-12 h-14 object-cover rounded-xs border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-stone-900">
                        {item.product_name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Bespoke Size: <strong className="text-[#064E3B]">{item.size}</strong> &bull; Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-stone-900 tabular-nums">
                    {formatNGN(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Garment Subtotal:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{formatNGN(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Atelier Concierge Dispatch:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {order.shipping_fee === 0 ? (
                    <span className="text-[#059669] font-bold">Complimentary</span>
                  ) : (
                    formatNGN(order.shipping_fee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span>Total Investment:</span>
                <span className="text-base text-[#064E3B] tabular-nums">
                  {formatNGN(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="bg-white p-4 border border-stone-200 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Destination Coordinates</span>
              </div>
              <div className="font-semibold text-stone-900">{order.shipping_address.fullName}</div>
              <div>{order.shipping_address.streetAddress}</div>
              <div>
                {order.shipping_address.area}, {order.shipping_address.stateOrCity}, Nigeria
              </div>
              <div className="text-stone-500 mt-1">Phone: {order.shipping_address.phone}</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Settlement & Guarantees</span>
              </div>
              <div>Payment: <strong className="text-stone-900">{order.payment_method}</strong></div>
              <div>Status: <strong className="text-emerald-700 uppercase font-bold">Verified</strong></div>
              <div className="mt-1 text-[11px] text-stone-500">
                Complimentary fitting alterations valid at Victoria Island Atelier for 14 days.
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onViewEmail(order)}
              className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4 text-[#F3E5AB]" />
              <span>Inspect Mailgun Confirmation Email</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto py-3 px-4 bg-white border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-xs hover:border-stone-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print Official Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-6 bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
