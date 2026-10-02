import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatNGN } from '../services/mailgun';
import { ClothingSize } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateItemSize,
    clearCart,
    subtotal,
    shippingFee,
    totalAmount,
    totalItemsCount,
  } = useCart();

  if (!isOpen) return null;

  const freeDeliveryThreshold = 300000;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const availableSizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 dark:bg-black/80 backdrop-blur-xs flex justify-end animate-fadeIn">
      
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF9F5] dark:bg-[#062118] h-full shadow-2xl flex flex-col z-10 border-l border-[#E7E2D5] dark:border-[#164132] transition-colors">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E7E2D5] dark:border-[#164132] bg-white dark:bg-[#07241B] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#064E3B] dark:text-[#34D399] font-bold">
              Serena Diamond Bespoke
            </div>
            <h2 className="font-serif text-xl text-stone-900 dark:text-[#FAF9F6] font-medium">
              Your Executive Bag ({totalItemsCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lagos Free Concierge Progress Bar */}
        <div className="px-6 py-3 bg-[#06392B] dark:bg-[#041812] text-[#FAF9F5] text-xs border-b dark:border-[#164132]">
          <div className="flex items-center justify-between mb-1.5 font-medium">
            <span className="text-[#F3E5AB]">
              {subtotal >= freeDeliveryThreshold ? (
                <span className="flex items-center gap-1 text-[#F3E5AB]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complimentary Lagos White-Glove Delivery Unlocked</span>
                </span>
              ) : (
                <span>
                  Add <strong className="text-white">{formatNGN(remainingForFreeDelivery)}</strong> for free Lagos delivery
                </span>
              )}
            </span>
            <span className="text-[10px] text-stone-300 dark:text-[#A7C4B8] tabular-nums">
              {Math.round(progressToFreeDelivery)}%
            </span>
          </div>
          <div className="w-full bg-white/20 dark:bg-white/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-[#C5A059] h-full transition-all duration-500"
              style={{ width: `${progressToFreeDelivery}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-[#0A2E22] border border-stone-200 dark:border-[#1E4D3E] flex items-center justify-center mx-auto text-stone-400 dark:text-[#A7C4B8]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-stone-800 dark:text-[#FAF9F6] font-medium">
                Your wardrobe bag is empty
              </h3>
              <p className="text-xs text-stone-500 dark:text-[#A7C4B8] max-w-xs mx-auto leading-relaxed">
                Discover our ready-to-wear corporate blazers, sheath dresses, and tailored suits crafted for women in leadership.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-[#04241B]"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] p-4 rounded-sm flex gap-4 relative group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-stone-100 dark:bg-[#041812] rounded-xs overflow-hidden shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('/images/')) {
                        target.src = target.src.replace('/images/', '/src/assets/images/');
                      }
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-stone-900 dark:text-[#FAF9F6] truncate">
                      {item.product.name}
                    </h4>

                    {/* Size Selector in Cart */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-stone-500 dark:text-[#8FA69B]">Size:</span>
                      <select
                        value={item.size}
                        onChange={(e) =>
                          updateItemSize(item.product.id, item.size, e.target.value as ClothingSize)
                        }
                        className="text-[11px] font-semibold text-[#064E3B] dark:text-[#34D399] bg-stone-50 dark:bg-[#0A2E22] border border-stone-200 dark:border-[#1E4D3E] rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                      >
                        {availableSizes.map((s) => (
                          <option key={s} value={s} className="dark:bg-[#07241B] dark:text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-xs font-bold text-[#064E3B] dark:text-[#34D399] mt-1 tabular-nums">
                      {formatNGN(item.product.price)}
                    </div>
                  </div>

                  {/* Stepper & Delete */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 dark:border-[#164132]">
                    <div className="flex items-center border border-stone-200 dark:border-[#1E4D3E] rounded bg-stone-50 dark:bg-[#0A2E22]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#0F3D2E] text-xs font-bold cursor-pointer"
                        title="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="px-2 text-xs font-semibold text-stone-800 dark:text-[#FAF9F6] min-w-[20px] text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#0F3D2E] text-xs font-bold cursor-pointer"
                        title="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="p-6 bg-white dark:bg-[#07241B] border-t border-[#E7E2D5] dark:border-[#164132] space-y-4">
            
            <div className="space-y-2 text-xs text-stone-600 dark:text-[#A7C4B8]">
              <div className="flex justify-between">
                <span>Garment Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-[#FAF9F6] tabular-nums">{formatNGN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lagos Concierge Dispatch</span>
                <span className="font-semibold text-stone-900 dark:text-[#FAF9F6] tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-[#059669] dark:text-[#34D399] uppercase font-bold">Complimentary</span>
                  ) : (
                    formatNGN(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-[#164132] text-sm font-bold text-stone-900 dark:text-[#FAF9F6]">
                <span>Estimated Total</span>
                <span className="font-sans text-base text-[#064E3B] dark:text-[#34D399] tabular-nums">
                  {formatNGN(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] hover:bg-[#04241B] dark:hover:bg-[#059669] transition-colors text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#F3E5AB] dark:text-[#041812]" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-[#8FA69B] pt-1">
                <button
                  onClick={clearCart}
                  className="hover:text-rose-700 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
                <span className="flex items-center gap-1 text-stone-500 dark:text-[#A7C4B8]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" />
                  <span>Secure Lagos Payment &bull; Paystack</span>
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
