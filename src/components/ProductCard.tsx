import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product, ClothingSize } from '../types';
import { formatNGN } from '../services/mailgun';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: ClothingSize) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm overflow-hidden hover:border-[#064E3B]/40 dark:hover:border-[#C5A059]/70 transition-all duration-300 hover:shadow-md">
      
      {/* Product Image Stage (70% visual height) */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[3/4] bg-[#F5F2EB] dark:bg-[#041812] overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('/images/')) {
              target.src = target.src.replace('/images/', '/src/assets/images/');
            }
          }}
        />

        {/* Quiet Subtle Stock Tag */}
        {product.stock_quantity <= 8 && (
          <div className="absolute top-3 left-3 bg-[#06392B]/90 dark:bg-[#041812]/90 backdrop-blur-xs text-[#F3E5AB] text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-xs border dark:border-[#164132]">
            Only {product.stock_quantity} Tailored
          </div>
        )}

        {/* Plus Size Badge */}
        {product.isPlusCollection && (
          <div className="absolute top-3 right-3 bg-[#FAF9F5]/95 dark:bg-[#0A2E22]/95 backdrop-blur-xs text-[#064E3B] dark:text-[#34D399] text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-xs border border-[#C5A059]/60 shadow-2xs">
            Curated Silhouette (Up to 4X)
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="px-4 py-2.5 bg-white/95 dark:bg-[#041812]/95 text-stone-900 dark:text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider shadow-lg hover:bg-[#064E3B] hover:text-[#FAF9F5] dark:hover:bg-[#10B981] dark:hover:text-[#041812] transition-colors flex items-center gap-2 cursor-pointer border dark:border-[#164132]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Garment Details</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-[#8FA69B] mb-1.5 uppercase tracking-wider">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">&bull;</span>
            <span>Lagos Atelier</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif text-lg font-medium text-stone-900 dark:text-[#FAF9F6] group-hover:text-[#064E3B] dark:group-hover:text-[#34D399] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 dark:text-[#A7C4B8] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-[#164132] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 block uppercase tracking-wider">Investment</span>
            <span className="font-sans font-bold text-base text-[#064E3B] dark:text-[#34D399] tabular-nums">
              {formatNGN(product.price)}
            </span>
          </div>

          {/* Quick Select Size */}
          <button
            onClick={() => onSelectProduct(product)}
            className="px-3 py-1.5 border border-stone-300 dark:border-[#1E4D3E] text-stone-800 dark:text-[#FAF9F6] text-xs font-medium uppercase tracking-wider rounded-xs hover:border-[#064E3B] hover:bg-[#064E3B] hover:text-[#FAF9F5] dark:hover:bg-[#10B981] dark:hover:text-[#041812] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Size</span>
          </button>
        </div>

      </div>

    </div>
  );
};
