import React from 'react';
import { Home, Grid, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  onGoHome: () => void;
  onOpenCollection: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
  activeSection?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onGoHome,
  onOpenCollection,
  onOpenCart,
  onOpenAdmin,
  onOpenAccount,
}) => {
  const { totalItemsCount } = useCart();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#041812]/95 backdrop-blur-md border-t border-[#E7E2D5] dark:border-[#164132] shadow-lg px-2 py-1 flex items-center justify-around h-16 safe-bottom transition-colors">
      
      {/* Atelier Home */}
      <button
        onClick={onGoHome}
        className="flex flex-col items-center justify-center min-w-[60px] min-h-[48px] text-stone-600 dark:text-[#A7C4B8] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
        aria-label="Atelier Home"
      >
        <Home className="w-5 h-5 text-stone-700 dark:text-[#FAF9F6]" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Atelier</span>
      </button>

      {/* Collection */}
      <button
        onClick={onOpenCollection}
        className="flex flex-col items-center justify-center min-w-[60px] min-h-[48px] text-stone-600 dark:text-[#A7C4B8] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
        aria-label="Collection"
      >
        <Grid className="w-5 h-5 text-stone-700 dark:text-[#FAF9F6]" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Catalogue</span>
      </button>

      {/* Bag / Cart with Badge */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center min-w-[60px] min-h-[48px] text-stone-600 dark:text-[#A7C4B8] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
        aria-label="Shopping Bag"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-stone-800 dark:text-[#FAF9F6]" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-[#064E3B] dark:bg-[#10B981] text-[#F3E5AB] dark:text-[#041812] text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs border border-[#FAF9F5] dark:border-[#041812]">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold text-[#064E3B] dark:text-[#34D399] tracking-tight mt-0.5">Bag</span>
      </button>

      {/* Admin Dashboard */}
      <button
        onClick={onOpenAdmin}
        className="relative flex flex-col items-center justify-center min-w-[60px] min-h-[48px] text-stone-600 dark:text-[#A7C4B8] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
        aria-label="Admin Dashboard"
      >
        <div className="relative">
          <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-800 dark:text-[#FAF9F6]">Admin</span>
      </button>

      {/* Executive Patron Profile */}
      <button
        onClick={onOpenAccount}
        className="flex flex-col items-center justify-center min-w-[60px] min-h-[48px] text-stone-600 dark:text-[#A7C4B8] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
        aria-label="Patron Account"
      >
        <User className="w-5 h-5 text-stone-700 dark:text-[#FAF9F6]" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Patron</span>
      </button>

    </nav>
  );
};
