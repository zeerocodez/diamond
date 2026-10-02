import React, { useState, useMemo } from 'react';
import { Product, ClothingSize, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: ClothingSize) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: ProductCategory[] = [
    'All',
    'Curated Plus & Silhouette',
    'African Heritage Tailoring',
    'Tailored Blazers',
    'Sheath Dresses',
    'Power Suits',
    'Luxury Trousers & Silk',
  ];

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Size filter
        if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as ClothingSize)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFabric = p.fabric.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric && !matchCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedSize, searchQuery, sortBy]);

  return (
    <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E7E2D5] dark:border-[#164132] gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#064E3B] dark:text-[#34D399] font-semibold mb-1">
            Ready-to-Wear Corporate Line
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-[#FAF9F6] font-normal">
            The Executive Suite Collection
          </h2>
        </div>
        <p className="text-sm text-stone-500 dark:text-[#A7C4B8] max-w-md">
          Bespoke tailoring refined for corporate boardrooms, public appearances, and international delegations.
        </p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] p-4 rounded-sm mb-8 space-y-4 shadow-2xs">
        
        {/* Category Tabs (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mr-2 shrink-0 hidden sm:inline">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors shrink-0 rounded-xs cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-[#0A2E22] text-stone-700 dark:text-[#C5D6CF] hover:bg-stone-200 dark:hover:bg-[#0F3D2E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-Filters: Size & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 dark:border-[#164132] text-xs">
          
          {/* Size Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-stone-500 dark:text-[#8FA69B] uppercase tracking-wider mr-1">
              Bespoke Size:
            </span>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-7 h-7 flex items-center justify-center font-medium rounded-xs transition-colors cursor-pointer ${
                  selectedSize === s
                    ? 'border-2 border-[#064E3B] dark:border-[#34D399] text-[#064E3B] dark:text-[#34D399] font-bold bg-[#064E3B]/5 dark:bg-[#10B981]/15'
                    : 'border border-stone-200 dark:border-[#1E4D3E] text-stone-600 dark:text-[#A7C4B8] hover:border-stone-400 dark:hover:border-stone-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Count */}
          <div className="flex items-center gap-4">
            <span className="text-stone-400 dark:text-stone-500 font-sans tabular-nums">
              Showing <strong className="text-stone-900 dark:text-[#FAF9F6]">{filteredProducts.length}</strong> creations
            </span>

            <div className="flex items-center gap-1.5 border border-stone-200 dark:border-[#1E4D3E] rounded px-2.5 py-1 bg-white dark:bg-[#0A2E22]">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 dark:text-[#8FA69B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-700 dark:text-[#FAF9F6] text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="dark:bg-[#07241B]">Featured Atelier Order</option>
                <option value="price-asc" className="dark:bg-[#07241B]">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-[#07241B]">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Grid List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#07241B] border border-[#E7E2D5] dark:border-[#164132] rounded-sm p-8">
          <p className="font-serif text-xl text-stone-700 dark:text-stone-300 mb-2">No garments found matching criteria</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
            Try adjusting your size or category filter, or reset your search term.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              setSelectedSize('All');
            }}
            className="px-6 py-2.5 bg-[#064E3B] dark:bg-[#10B981] text-[#FAF9F5] dark:text-[#041812] text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      )}

    </section>
  );
};
