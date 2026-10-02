import React, { useState, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { authService } from '../services/auth';
import { User } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenFitting: () => void;
  onOpenEnvModal: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAuth,
  onOpenAccount,
  onOpenFitting,
  onOpenEnvModal,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const { totalItemsCount } = useCart();
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    return authService.subscribe((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <>
      {/* Top Quiet Announcement Bar */}
      <div className="bg-[#06392B] dark:bg-[#02150E] text-[#F3E5AB] text-xs font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-[#04241B] dark:border-[#10B981]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">Victoria Island Atelier &bull; Lagos, Nigeria</span>
          <span className="mx-auto sm:mx-0">Complimentary Lagos White-Glove Delivery on Orders Over ₦300,000</span>
          <button
            onClick={onOpenFitting}
            className="hidden md:inline hover:underline text-[#FAF9F5] transition-colors cursor-pointer"
          >
            Book Private Fitting
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#041812]/95 backdrop-blur-md border-b border-[#E7E2D5] dark:border-[#164132] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="#" className="flex flex-col group text-left">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.14em] uppercase text-[#06392B] dark:text-[#FAF9F6] font-semibold transition-colors group-hover:text-[#097257] dark:group-hover:text-[#34D399]">
                Serena Diamond
              </span>
              <span className="text-[10px] tracking-[0.32em] uppercase text-[#C5A059] dark:text-[#E5C378] font-medium -mt-1">
                Bespoke &bull; Lagos
              </span>
            </a>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-700 dark:text-[#C5D6CF]">
            <button
              onClick={() => {
                onSelectCategory('All');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer ${
                selectedCategory === 'All' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => {
                onSelectCategory('African Heritage Tailoring');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'African Heritage Tailoring' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              <span>African Heritage</span>
              <span className="text-[9px] bg-[#C5A059]/20 text-[#8F7029] dark:text-[#F3E5AB] font-bold px-1.5 py-0.2 rounded uppercase">New</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('Curated Plus & Silhouette');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'Curated Plus & Silhouette' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              <span>Curated Plus</span>
              <span className="text-[9px] bg-[#064E3B]/10 dark:bg-[#10B981]/20 text-[#064E3B] dark:text-[#34D399] font-bold px-1.5 py-0.2 rounded uppercase">1X-4X</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('Tailored Blazers');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer ${
                selectedCategory === 'Tailored Blazers' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              Blazers
            </button>
            <button
              onClick={() => {
                onSelectCategory('Sheath Dresses');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer ${
                selectedCategory === 'Sheath Dresses' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              Sheath Dresses
            </button>
            <button
              onClick={() => {
                onSelectCategory('Power Suits');
                window.scrollTo({ top: 720, behavior: 'smooth' });
              }}
              className={`hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer ${
                selectedCategory === 'Power Suits' ? 'text-[#064E3B] dark:text-[#34D399] font-semibold' : ''
              }`}
            >
              Power Suits
            </button>
          </nav>

          {/* Zone 3: Interactive controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Bar / Input */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search silk, crepe, blazers..."
                    autoFocus
                    className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-white dark:bg-[#08271D] border border-stone-300 dark:border-[#1E4D3E] text-stone-900 dark:text-[#FAF9F6] rounded focus:outline-none focus:border-[#064E3B] dark:focus:border-[#34D399] shadow-inner"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="absolute right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-stone-700 dark:text-[#C5D6CF] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
                  title="Search bespoke collection"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account / Google Auth */}
            {currentUser ? (
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-2 p-1 text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer group"
                title={`Signed in as ${currentUser.name}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A059] bg-stone-100 flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#064E3B]">
                      {currentUser.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-xs font-medium text-stone-700 dark:text-[#C5D6CF] max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399] border border-stone-300 dark:border-[#1E4D3E] rounded hover:border-[#064E3B] dark:hover:border-[#34D399] transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Admin Dashboard Launcher */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#064E3B] dark:text-[#34D399] bg-[#FAF9F5] dark:bg-[#07241B] hover:bg-[#064E3B] hover:text-[#FAF9F5] dark:hover:bg-[#10B981] dark:hover:text-[#041812] border border-[#C5A059]/60 rounded transition-all cursor-pointer shadow-2xs group"
              title="Atelier Admin Dashboard & Mailgun Hub"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A059] group-hover:text-[#F3E5AB] dark:group-hover:text-[#041812]" />
              <span className="hidden md:inline">Admin Hub</span>
            </button>

            {/* Theme Toggle Button (Light / Midnight Emerald) */}
            <ThemeToggle />

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399] transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#064E3B] dark:bg-[#10B981] text-[#F3E5AB] dark:text-[#041812] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Tech Stack / Env helper button */}
            <button
              onClick={onOpenEnvModal}
              title="Architecture & Environment Settings"
              className="hidden lg:flex p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E2D5] dark:border-[#164132] bg-[#FAF9F5] dark:bg-[#051F17] px-6 py-4 space-y-3">
            
            {/* Full-width Theme Switcher in mobile drawer */}
            <div className="pb-2 border-b border-[#E7E2D5] dark:border-[#164132]">
              <ThemeToggle variant="full" />
            </div>

            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#064E3B] dark:bg-[#0A3326] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-between shadow-xs border dark:border-[#1E4D3E]"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Atelier Admin Dashboard</span>
              </span>
              <span className="text-[10px] text-[#F3E5AB] bg-[#04241B] px-1.5 py-0.5 rounded">Mailgun Active</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('All');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399]"
            >
              Full Collection
            </button>
            <button
              onClick={() => {
                onSelectCategory('African Heritage Tailoring');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-[#064E3B] dark:text-[#34D399] flex items-center justify-between"
            >
              <span>African Heritage Tailoring</span>
              <span className="text-[10px] bg-[#C5A059]/20 text-[#8F7029] dark:text-[#F3E5AB] font-bold px-2 py-0.5 rounded">NEW</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('Curated Plus & Silhouette');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-[#064E3B] dark:text-[#34D399] flex items-center justify-between"
            >
              <span>Curated Plus & Silhouette</span>
              <span className="text-[10px] bg-[#064E3B]/10 dark:bg-[#10B981]/20 text-[#064E3B] dark:text-[#34D399] font-bold px-2 py-0.5 rounded">1X-4X</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('Tailored Blazers');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399]"
            >
              Tailored Blazers
            </button>
            <button
              onClick={() => {
                onSelectCategory('Sheath Dresses');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399]"
            >
              Sheath Dresses
            </button>
            <button
              onClick={() => {
                onSelectCategory('Power Suits');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399]"
            >
              Power Suits
            </button>
            <button
              onClick={() => {
                onSelectCategory('Luxury Trousers & Silk');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-[#FAF9F6] hover:text-[#064E3B] dark:hover:text-[#34D399]"
            >
              Trousers & Silk
            </button>
            <div className="pt-2 border-t border-stone-200 dark:border-[#164132]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenFitting();
                }}
                className="w-full text-center py-2.5 bg-[#064E3B] dark:bg-[#10B981] text-[#F3E5AB] dark:text-[#041812] text-xs font-semibold uppercase tracking-wider rounded"
              >
                Book Victoria Island Fitting
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
