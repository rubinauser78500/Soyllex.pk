/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookbookSection } from './components/LookbookSection';
import { CraftSection } from './components/CraftSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';

import { PRODUCTS, CURRENCIES } from './data/products';
import {
  Product,
  Category,
  CartItem,
  ColorVariant,
  CurrencyConfig,
  OrderDetails,
} from './types/store';
import { Search, X, Check, Sparkles } from 'lucide-react';

export default function App() {
  // Localization State - Defaults to PKR for authentic Pakistani experience
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.PKR);

  // Cart & Wishlist State with localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noor_wishlist');
      return saved ? JSON.parse(saved) : ['pak-lawn-01', 'pak-silk-02'];
    } catch {
      return ['pak-lawn-01', 'pak-silk-02'];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noor_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('noor_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Discount / Voucher State
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // UI Modal / Drawer States
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Catalog Filter State
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPieces, setSelectedPieces] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    size: string,
    color: ColorVariant,
    quantity: number = 1,
    stitching?: 'Unstitched' | 'Stitched Pret'
  ) => {
    const itemKey = `${product.id}-${size}-${color.name}-${stitching || 'std'}`;
    const unitPriceUSD = size === 'Unstitched' ? product.priceUSD : product.priceUSD + 20;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            productId: product.id,
            product,
            selectedColor: color,
            selectedSize: size,
            stitchingOption: stitching,
            quantity,
            unitPriceUSD,
          },
        ];
      }
    });

    showToast(`Added ${product.name} (${size}) to shopping bag`);
  };

  const handleQuickAdd = (product: Product, size: string) => {
    handleAddToCart(product, size, product.colors[0], 1, size === 'Unstitched' ? 'Unstitched' : 'Stitched Pret');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved to wishlist`);
        return [...prev, product.id];
      }
    });
  };

  // Promo Voucher
  const handleApplyDiscount = (code: string): boolean => {
    if (code === 'EID15' || code === 'ATELIER15') {
      setDiscountCode(code);
      setDiscountPercent(15);
      return true;
    }
    if (code === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      setDiscountPercent(0);
      return true;
    }
    return false;
  };

  // Wishlist product objects
  const wishlistedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Pieces filter
      if (selectedPieces !== 'All' && product.pieces !== selectedPieces) {
        return false;
      }
      // In stock
      if (inStockOnly) {
        const hasStock = product.sizes.some((s) => s.inStock);
        if (!hasStock) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesMaterial = product.material.toLowerCase().includes(q);
        const matchesOrigin = product.origin.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesMaterial && !matchesOrigin && !matchesSubtitle) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-high') return b.priceUSD - a.priceUSD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedPieces, searchQuery, sortBy, inStockOnly]);

  const categories: Category[] = [
    'All',
    'Embroidered Lawn',
    'Luxury Pret',
    'Festive & Formal',
    'Chikankari',
    'Raw Silk',
    'Dupattas & Shawls',
  ];

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStory = () => {
    const el = document.getElementById('atelier');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1A1A]">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-[#FAF9F5] py-3 px-5 rounded-sm shadow-xl flex items-center gap-3 text-xs font-mono border border-white/20 transition-all duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.length}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onSearchClick={() => setSearchModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onScrollToLookbook={scrollToLookbook}
        onScrollToStory={scrollToStory}
        selectedCategory={selectedCategory}
      />

      {/* Hero Campaign */}
      <Hero
        onShopCollection={scrollToCatalog}
        onExploreLookbook={scrollToLookbook}
      />

      {/* Main Catalog Section */}
      <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E8E6DF] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#73716B]">
              <Sparkles className="w-3 h-3 text-[#C2A382]" />
              <span>Pakistani Ladies Collection · SS26</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-1.5 font-medium">
              New Arrival Pret &amp; Unstitched Suits
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#73716B]">
            <span>Showing {filteredProducts.length} designer ensembles</span>
          </div>
        </div>

        {/* Filter Bar & Segmented Controls */}
        <div className="pt-6 pb-8 space-y-4">
          {/* Category Tabs (Segmented Button Controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium tracking-wide rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-[#FAF9F5] shadow-xs'
                    : 'bg-[#F2EFE9] text-[#615F5B] hover:text-[#1A1A1A] hover:bg-[#EAE7DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub-Filters: Pieces, In Stock, Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            {/* Pieces Selector */}
            <div className="flex items-center bg-[#F2EFE9] p-1 rounded-sm">
              {['All', '3 Piece', '2 Piece', '1 Piece'].map((pieceOption) => (
                <button
                  key={pieceOption}
                  onClick={() => setSelectedPieces(pieceOption)}
                  className={`px-3 py-1 font-mono transition-colors cursor-pointer ${
                    selectedPieces === pieceOption
                      ? 'bg-white text-[#1A1A1A] font-semibold shadow-xs'
                      : 'text-[#73716B] hover:text-[#1A1A1A]'
                  }`}
                >
                  {pieceOption}
                </button>
              ))}
            </div>

            {/* In stock toggle & Sort */}
            <div className="flex items-center gap-4 ml-auto">
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer text-[#52504C]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#1A1A1A] cursor-pointer"
                />
                <span>Ready to Dispatch</span>
              </label>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#8C8A84] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F2EFE9] border border-[#E0DED7] rounded-sm px-2.5 py-1 text-xs text-[#1A1A1A] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Search Filter Badge if present */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs font-mono bg-[#EFECE6] px-3 py-1.5 rounded-sm w-fit text-[#1A1A1A]">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#73716B] hover:text-[#1A1A1A] ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Product Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center border border-[#ECEAE4] rounded-sm bg-white my-8">
            <h3 className="font-serif text-xl text-[#1A1A1A]">No garments match your selection</h3>
            <p className="text-xs text-[#73716B] mt-2 font-mono">
              Try adjusting your category or search keyword filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPieces('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={setActiveProduct}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </section>

      {/* SS26 Interactive Lookbook "Shop the Look" */}
      <LookbookSection
        products={PRODUCTS}
        currency={currency}
        onOpenProduct={setActiveProduct}
      />

      {/* Atelier Craftsmanship & Heritage Section */}
      <CraftSection />

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={activeProduct}
        currency={currency}
        isOpen={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        isWishlisted={activeProduct ? wishlistIds.includes(activeProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        discountCode={discountCode}
        discountPercent={discountPercent}
        onApplyDiscount={handleApplyDiscount}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistedProducts}
        currency={currency}
        onRemoveItem={(id) => setWishlistIds((prev) => prev.filter((item) => item !== id))}
        onMoveToBag={(product) => {
          setWishlistOpen(false);
          setActiveProduct(product);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        discountPercent={discountPercent}
        discountCode={discountCode}
        onOrderCompleted={() => {
          setCartItems([]);
        }}
      />

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-[#E0DED7] rounded-sm shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEAE4]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#73716B]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Swiss lawn, pure silk dupatta, zardozi, raw silk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchModalOpen(false);
                      scrollToCatalog();
                    }
                  }}
                  className="w-full text-base font-light focus:outline-none placeholder-[#A3A099]"
                />
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-[#73716B] hover:text-[#1A1A1A] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Keyword Suggestions */}
            <div className="mt-4">
              <span className="text-[11px] font-mono uppercase text-[#73716B]">Popular Pakistani searches:</span>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {['Embroidered Lawn', 'Silk Dupatta', 'Raw Silk Kalidar', 'Chikankari Pret', 'Sharara', 'Pashmina Shawl'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setSearchModalOpen(false);
                      scrollToCatalog();
                    }}
                    className="px-3 py-1 bg-[#F5F4EE] hover:bg-[#EAE7DF] text-xs font-mono rounded-sm text-[#4A4844] cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSearchModalOpen(false);
                scrollToCatalog();
              }}
              className="mt-6 w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-sm hover:bg-[#333333] transition-colors cursor-pointer"
            >
              View Results ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
