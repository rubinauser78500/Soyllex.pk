import { useState } from 'react';
import { ShoppingBag, Heart, Search, X, Menu, Globe, Sparkles } from 'lucide-react';
import { CurrencyCode, CurrencyConfig, Category } from '../types/store';
import { CURRENCIES } from '../data/products';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentCurrency: CurrencyConfig;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearchClick: () => void;
  onSelectCategory: (category: Category) => void;
  onScrollToLookbook: () => void;
  onScrollToStory: () => void;
  selectedCategory: Category;
}

export function Navbar({
  cartCount,
  wishlistCount,
  currentCurrency,
  onSelectCurrency,
  onOpenCart,
  onOpenWishlist,
  onSearchClick,
  onSelectCategory,
  onScrollToLookbook,
  onScrollToStory,
  selectedCategory,
}: NavbarProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks: { label: string; action: () => void; active?: boolean }[] = [
    { label: 'New Arrivals', action: () => onSelectCategory('All'), active: selectedCategory === 'All' },
    { label: 'Embroidered Lawn', action: () => onSelectCategory('Embroidered Lawn'), active: selectedCategory === 'Embroidered Lawn' },
    { label: 'Luxury Pret', action: () => onSelectCategory('Luxury Pret'), active: selectedCategory === 'Luxury Pret' },
    { label: 'Festive Formals', action: () => onSelectCategory('Festive & Formal'), active: selectedCategory === 'Festive & Formal' },
    { label: 'Chikan-Kari', action: () => onSelectCategory('Chikankari'), active: selectedCategory === 'Chikankari' },
    { label: 'Silk & Shawls', action: () => onSelectCategory('Dupattas & Shawls'), active: selectedCategory === 'Dupattas & Shawls' },
    { label: 'Lookbook', action: onScrollToLookbook },
    { label: 'Heritage Craft', action: onScrollToStory },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E6DF] transition-all">
      {/* Slim Dismissible Top Notification Banner */}
      {showBanner && (
        <div className="bg-[#1A1A1A] text-[#FAF9F5] text-xs font-medium py-2 px-4 flex items-center justify-between">
          <div className="flex-1 text-center truncate flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A382] shrink-0" />
            <span>Eid &amp; Summer Capsule 2026 Live · Free Cash on Delivery Across Pakistan</span>
            <span className="mx-1 opacity-50">·</span>
            <span className="text-[#C2A382]">Worldwide Express Delivery to UK, USA &amp; UAE</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#FAF9F5]/70 hover:text-white ml-2 transition-colors focus-visible:outline-none"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              onSelectCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#1A1A1A] hover:opacity-80 transition-opacity uppercase text-left focus-visible:outline-none"
          >
            Noor-e-Atelier
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs tracking-wider uppercase font-medium">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`relative py-1 whitespace-nowrap transition-colors cursor-pointer ${
                link.active
                  ? 'text-[#1A1A1A] font-bold'
                  : 'text-[#615F5B] hover:text-[#1A1A1A]'
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1A1A1A]" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            aria-label="Search Pakistani garments"
            className="p-2 text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 py-1.5 px-2 text-xs font-mono font-medium text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#EFECE6] rounded-md transition-colors cursor-pointer"
              aria-label="Change currency"
            >
              <Globe className="w-3.5 h-3.5 text-[#73716B]" />
              <span>{currentCurrency.code}</span>
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white border border-[#E8E6DF] rounded-md shadow-lg py-1 z-20 text-xs font-mono">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                    const curr = CURRENCIES[code];
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          onSelectCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#FAF9F5] transition-colors ${
                          currentCurrency.code === code ? 'font-bold text-[#1A1A1A] bg-[#F5F4EE]' : 'text-[#615F5B]'
                        }`}
                      >
                        <span>{code}</span>
                        <span className="text-[#8C8A84]">{curr.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative p-2 text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[10px] font-mono tabular-nums flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with dynamic counter */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="relative flex items-center gap-2 py-1.5 px-3 bg-[#1A1A1A] text-white text-xs font-medium rounded-full hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono tabular-nums font-semibold">{cartCount}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#4A4844] hover:text-[#1A1A1A] rounded-md cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E8E6DF] bg-[#FAF9F5] px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                link.action();
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-sm font-medium ${
                link.active ? 'text-[#1A1A1A] font-bold' : 'text-[#615F5B]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
