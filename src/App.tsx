/**
 * Serena Diamond Bespoke
 * High-End Luxury Ready-to-Wear Corporate Attire for Executive Women
 * Victoria Island & Ikoyi &bull; Lagos, Nigeria
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { dbService } from './services/db';
import { authService } from './services/auth';
import { Product, ClothingSize, Order } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AtelierPillars } from './components/AtelierPillars';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MailgunEmailModal } from './components/MailgunEmailModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { BespokeFittingModal } from './components/BespokeFittingModal';
import { EnvConfigDrawer } from './components/EnvConfigDrawer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

function MainStorefront() {
  const { addToCart, isCartOpen, setIsCartOpen } = useCart();

  // Data & Filters
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isFittingOpen, setIsFittingOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Post-order states
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [mailgunEmailOrder, setMailgunEmailOrder] = useState<Order | null>(null);

  useEffect(() => {
    setProducts(dbService.getProducts());
    return dbService.subscribe(() => {
      setProducts([...dbService.getProducts()]);
    });
  }, []);

  const handleQuickAdd = (product: Product, size: ClothingSize) => {
    addToCart(product, size, 1);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-[#041812] text-stone-900 dark:text-[#FAF9F6] font-sans selection:bg-[#064E3B] dark:selection:bg-[#10B981] selection:text-[#F3E5AB] dark:selection:text-[#041812] pb-16 sm:pb-0 transition-colors duration-300">
      
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenFitting={() => setIsFittingOpen(true)}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1">
        {/* Campaign Hero Banner */}
        <Hero
          onExploreCollection={scrollToCollection}
          onBookFitting={() => setIsFittingOpen(true)}
        />

        {/* 4 Brand Pillars (Victoria Island Atelier, Italian Textiles, White-Glove Dispatch, Fit Guarantee) */}
        <AtelierPillars />

        {/* Product Grid with Filters & Search */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
        />
      </main>

      {/* Atelier Footer */}
      <Footer
        onOpenFitting={() => setIsFittingOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Mobile-First Sticky Ergonomic Bottom Navigation */}
      <MobileBottomNav
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenCollection={scrollToCollection}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAccount={() => {
          if (authService.isAuthenticated()) {
            setIsAccountOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
      />

      {/* Atelier Admin Dashboard & Mailgun Transactional Manager */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenOrderReceipt={(ord) => setConfirmedOrder(ord)}
        onOpenEmailPreview={(ord) => setMailgunEmailOrder(ord)}
      />

      {/* Product Detail / Add to Cart Modal with Size Selection & Stock Verification */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, size, qty) => addToCart(prod, size, qty)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* African Executive Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Interactive Cart Drawer / Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal (Protected Route) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onPromptAuth={() => setIsAuthOpen(true)}
      />

      {/* Order Confirmation Screen (/order-confirmation/[id]) */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewEmail={(ord) => setMailgunEmailOrder(ord)}
      />

      {/* Mailgun Transactional Email Preview & Tester Modal */}
      <MailgunEmailModal
        order={mailgunEmailOrder}
        onClose={() => setMailgunEmailOrder(null)}
      />

      {/* Google OAuth 2.0 Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          // Re-open checkout if user was trying to checkout
        }}
      />

      {/* Patron Account & Order History */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onViewOrderEmail={(ord) => setMailgunEmailOrder(ord)}
        onOpenOrderReceipt={(ord) => setConfirmedOrder(ord)}
      />

      {/* Private Victoria Island Atelier Bespoke Fitting */}
      <BespokeFittingModal
        isOpen={isFittingOpen}
        onClose={() => setIsFittingOpen(false)}
      />

      {/* Developer & Architecture Drawer (.env.local, PostgreSQL schema, Mailgun setup) */}
      <EnvConfigDrawer
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MainStorefront />
      </CartProvider>
    </ThemeProvider>
  );
}
