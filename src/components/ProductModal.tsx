import React, { useState } from 'react';
import { X, Ruler, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product, ClothingSize } from '../types';
import { formatNGN } from '../services/mailgun';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ClothingSize, quantity: number) => void;
  onOpenSizeGuide: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(product?.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync size when product changes
  React.useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Dialog Card */}
      <div className="relative bg-[#FAF9F5] dark:bg-[#07241B] w-full max-w-4xl rounded-sm border border-[#E7E2D5] dark:border-[#164132] shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-white/80 dark:bg-[#041812]/80 rounded-full transition-colors cursor-pointer border dark:border-[#164132]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative bg-[#F5F2EB] dark:bg-[#041812] aspect-[3/4] md:aspect-auto">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.includes('/images/')) {
                  target.src = target.src.replace('/images/', '/src/assets/images/');
                }
              }}
            />
            <div className="absolute bottom-4 left-4 bg-[#06392B]/85 dark:bg-[#041812]/90 backdrop-blur-xs text-[#F3E5AB] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-xs border dark:border-[#164132]">
              Hand-Tailored &bull; Victoria Island Atelier
            </div>
          </div>

          {/* Right: Product Purchase Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Category & Atelier Origin */}
              <div className="text-xs uppercase tracking-widest text-[#064E3B] dark:text-[#34D399] font-semibold mb-2">
                {product.category} &bull; Lagos Atelier
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-[#FAF9F6] font-normal leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-sans font-bold text-2xl text-[#064E3B] dark:text-[#34D399] tabular-nums">
                  {formatNGN(product.price)}
                </span>
                <span className="text-xs text-stone-500 dark:text-[#8FA69B]">
                  (Inclusive of luxury VAT & complimentary alterations)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 dark:text-[#A7C4B8] leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Size Selector with Size Guide trigger */}
              <div className="mt-6 pt-5 border-t border-stone-200 dark:border-[#164132]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-[#FAF9F6]">
                    Select Bespoke Size:
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-xs text-[#C5A059] dark:text-[#E5C378] hover:text-[#9B7D3B] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Executive Size Chart</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-3 py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] shadow-xs ring-1 ring-[#C5A059]'
                          : 'bg-white dark:bg-[#0A2E22] border border-stone-300 dark:border-[#1E4D3E] text-stone-700 dark:text-[#FAF9F6] hover:border-stone-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Stock Verification Status */}
                <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-[#8FA69B]">
                  <span className="flex items-center gap-1.5 text-[#064E3B] dark:text-[#34D399]">
                    <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#10B981] animate-pulse" />
                    <span>In Stock for Immediate Lagos Dispatch</span>
                  </span>
                  <span className="tabular-nums">
                    {product.stock_quantity} available in atelier
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-[#FAF9F6]">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-300 dark:border-[#1E4D3E] rounded bg-white dark:bg-[#0A2E22]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0F3D2E] text-sm font-bold cursor-pointer"
                  >
                    &minus;
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-stone-900 dark:text-[#FAF9F6] min-w-[28px] text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0F3D2E] text-sm font-bold cursor-pointer"
                  >
                    &#43;
                  </button>
                </div>
              </div>

              {/* Textile & Atelier Notes */}
              <div className="mt-6 p-3.5 bg-white dark:bg-[#0A2E22] border border-[#E7E2D5] dark:border-[#164132] rounded-xs space-y-2 text-xs text-stone-600 dark:text-[#A7C4B8]">
                <div>
                  <strong className="text-stone-900 dark:text-[#FAF9F6]">Textile: </strong>
                  {product.fabric}
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-[#FAF9F6]">Tailoring Cut: </strong>
                  {product.cut}
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-[#FAF9F6]">Care: </strong>
                  {product.care}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 dark:border-[#164132] space-y-3">
              <button
                onClick={handleAdd}
                disabled={addedAnimation}
                className="w-full py-4 bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] hover:bg-[#04241B] dark:hover:bg-[#059669] transition-colors text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#F3E5AB] dark:text-[#041812]" />
                    <span>Added to Garment Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#F3E5AB] dark:text-[#041812]" />
                    <span>Add to Executive Wardrobe &bull; {formatNGN(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-[11px] text-stone-500 dark:text-[#8FA69B]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" />
                  <span>Ikoyi & VI Same-Day Option</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] dark:text-[#E5C378]" />
                  <span>14-Day Free Fitting Adjustments</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
