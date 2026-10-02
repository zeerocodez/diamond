import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Building2, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { authService } from '../services/auth';
import { dbService } from '../services/db';
import { sendOrderConfirmationEmail, formatNGN } from '../services/mailgun';
import { Order, OrderItem, ShippingAddress } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onPromptAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onPromptAuth,
}) => {
  const { cart, subtotal, shippingFee, totalAmount, clearCart, shippingZone, setShippingZone } = useCart();
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: currentUser?.name || 'Dr. Folashade Adeleke',
    email: currentUser?.email || 'folashade.adeleke@lagoscapital.ng',
    phone: '+234 803 555 0192',
    streetAddress: '14A Walter Carrington Crescent',
    area: 'Victoria Island',
    stateOrCity: 'Lagos',
    deliveryNotes: 'Deliver to Executive Suite / Call upon arrival at security gate.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'paystack-card' | 'bank-transfer' | 'flutterwave'>('paystack-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Protect Checkout Route: Prompt login if unauthenticated
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-[#FAF9F5] w-full max-w-md rounded-sm border border-[#E7E2D5] shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-medium">
            Executive Authentication Required
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            To ensure personalized bespoke fitting records, concierge delivery tracking, and order insurance, please sign in with your Google account.
          </p>
          <button
            onClick={() => {
              onClose();
              onPromptAuth();
            }}
            className="w-full py-3.5 bg-[#064E3B] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#04241B] transition-colors cursor-pointer"
          >
            Sign In with Google to Complete Order
          </button>
        </div>
      </div>
    );
  }

  const handleAreaChange = (area: string) => {
    let zone: any = 'lagos-island';
    if (['Ikeja GRA', 'Magodo', 'Maryland', 'Surulere', 'Yaba'].includes(area)) {
      zone = 'lagos-mainland';
    } else if (area.includes('Abuja')) {
      zone = 'abuja-fct';
    } else if (['Port Harcourt', 'Enugu', 'Ibadan'].includes(area)) {
      zone = 'other-states';
    } else {
      zone = 'lagos-island';
    }
    setShippingZone(zone);
    setFormData((prev) => ({ ...prev, area }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Your bag is currently empty.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.streetAddress) {
      setErrorMessage('Please complete all mandatory delivery fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Construct Order Record
      const orderId = `SDB-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderItems: OrderItem[] = cart.map((item, idx) => ({
        id: `itm-${orderId}-${idx + 1}`,
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        size: item.size,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const newOrder: Order = {
        id: orderId,
        user_id: currentUser.id,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        shipping_address: formData,
        payment_status: 'paid',
        order_status: 'pending',
        payment_method:
          paymentMethod === 'paystack-card'
            ? 'Paystack Card Payment (Instant)'
            : paymentMethod === 'flutterwave'
            ? 'Flutterwave Checkout'
            : 'Stanbic IBTC / GTBank Direct Wire',
        created_at: new Date().toISOString(),
        items: orderItems,
      };

      // 2. Persist in Database
      dbService.createOrder(newOrder);

      // 3. Dispatch Transactional Confirmation Email via Mailgun
      const mailgunResult = await sendOrderConfirmationEmail(newOrder);
      newOrder.mailgun_status = mailgunResult.status;
      newOrder.mailgun_message_id = mailgunResult.messageId;

      // 4. Empty Cart
      clearCart();

      // 5. Callback to success view
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF9F5] w-full max-w-4xl rounded-sm border border-[#E7E2D5] shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E7E2D5] bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#064E3B] font-bold">
              Serena Diamond Bespoke &bull; Secure Checkout
            </div>
            <h2 className="font-serif text-2xl text-stone-900 font-medium">
              Concierge Order Placement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Step 1: Customer Details */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Executive Recipient Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="e.g. Dr. Folashade Adeleke"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Confirmation Email (For Mailgun Invoice)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="name@company.ng"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Mobile Phone (For Lagos White-Glove Dispatch)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="+234 803 000 0000"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & Lagos Zone */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Atelier Concierge Destination</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Lagos / State Region
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none cursor-pointer"
                    >
                      <optgroup label="Lagos Island & Coastal Hubs (Fastest Dispatch)">
                        <option value="Victoria Island">Victoria Island, Lagos</option>
                        <option value="Ikoyi">Ikoyi, Lagos</option>
                        <option value="Banana Island">Banana Island, Ikoyi</option>
                        <option value="Lekki Phase 1">Lekki Phase 1, Lagos</option>
                        <option value="Eko Atlantic">Eko Atlantic City</option>
                        <option value="Chevron / Osapa London">Chevron / Osapa London</option>
                      </optgroup>
                      <optgroup label="Lagos Mainland">
                        <option value="Ikeja GRA">Ikeja GRA, Lagos</option>
                        <option value="Maryland">Maryland / Anthony, Lagos</option>
                        <option value="Magodo Phase 2">Magodo GRA, Lagos</option>
                        <option value="Surulere">Surulere, Lagos</option>
                      </optgroup>
                      <optgroup label="Other Corporate Centers (Air Concierge)">
                        <option value="Abuja Maitama / Asokoro">Abuja FCT (Maitama / Asokoro)</option>
                        <option value="Port Harcourt">Port Harcourt (Old GRA)</option>
                        <option value="Ibadan">Ibadan (Bodija / Jericho)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.stateOrCity}
                      className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded text-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Street Address / Corporate Suite
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="e.g. Penthouse 4, Kingsway Tower, Alfred Rewane Road"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    Delivery & Tailoring Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:border-[#064E3B] focus:outline-none"
                    placeholder="e.g. Leave with executive assistant on 5th floor"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Payment Settlement Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setPaymentMethod('paystack-card')}
                  className={`p-3 border rounded-xs flex flex-col justify-between cursor-pointer transition-all ${
                    paymentMethod === 'paystack-card'
                      ? 'border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-4 h-4 text-[#064E3B]" />
                    {paymentMethod === 'paystack-card' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Paystack Card</div>
                    <div className="text-[10px] text-stone-500">Mastercard, Visa, Verve</div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('bank-transfer')}
                  className={`p-3 border rounded-xs flex flex-col justify-between cursor-pointer transition-all ${
                    paymentMethod === 'bank-transfer'
                      ? 'border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    {paymentMethod === 'bank-transfer' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Direct Bank Wire</div>
                    <div className="text-[10px] text-stone-500">Stanbic IBTC / GTBank</div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`p-3 border rounded-xs flex flex-col justify-between cursor-pointer transition-all ${
                    paymentMethod === 'flutterwave'
                      ? 'border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                    {paymentMethod === 'flutterwave' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Flutterwave</div>
                    <div className="text-[10px] text-stone-500">Instant Verification</div>
                  </div>
                </label>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between space-y-6">
            
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Commission Summary ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-xs border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Size: <strong className="text-[#064E3B]">{item.size}</strong> &bull; Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatNGN(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">{formatNGN(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Lagos Concierge White-Glove Dispatch</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-[#059669] font-bold uppercase">Complimentary</span>
                    ) : (
                      formatNGN(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Executive Fitting & Alteration Coverage</span>
                  <span className="text-[#064E3B] font-semibold">Included</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-stone-200 text-base font-bold text-stone-900">
                  <span>Total Due</span>
                  <span className="text-lg text-[#064E3B] tabular-nums">
                    {formatNGN(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Mailgun Guarantee Notice */}
              <div className="mt-6 p-3 bg-[#FAF9F5] border border-stone-200 rounded text-[11px] text-stone-600 space-y-1">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Automated Transactional Dispatch</span>
                </div>
                <p>
                  A branded order invoice and tailor tracking token will be immediately dispatched to <strong>{formData.email}</strong> via Mailgun.
                </p>
              </div>

            </div>

            {/* Submit Action */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#064E3B] text-[#FAF9F5] hover:bg-[#04241B] transition-colors text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Transacting Order & Notifying Atelier...</span>
                ) : (
                  <span>Place Bespoke Order &bull; {formatNGN(totalAmount)}</span>
                )}
              </button>

              <div className="text-center text-[10px] text-stone-400">
                By placing your order you agree to Serena Diamond Bespoke’s Victoria Island Atelier Terms & Care Guidelines.
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
