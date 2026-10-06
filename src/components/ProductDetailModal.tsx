import { useState } from 'react';
import { X, Heart, Star, ShieldCheck, RefreshCw, Truck, Check, Package, Sparkles } from 'lucide-react';
import { Product, CurrencyConfig, ColorVariant } from '../types/store';
import { formatPrice } from '../utils/format';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductDetailModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: ColorVariant,
    quantity: number,
    stitching?: 'Unstitched' | 'Stitched Pret'
  ) => void;
}

export function ProductDetailModal({
  product,
  currency,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size || 'Unstitched'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'includes' | 'embroidery' | 'shipping' | 'reviews'>('includes');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const images = [product.image, product.secondaryImage || product.image];
  const currentSizeOption = product.sizes.find((s) => s.size === selectedSize);

  // Price adjustment for custom stitched vs unstitched
  const isStitched = selectedSize !== 'Unstitched';
  const stitchingAddonUSD = isStitched ? 20 : 0;
  const effectivePriceUSD = product.priceUSD + stitchingAddonUSD;

  const handleAdd = () => {
    if (!currentSizeOption?.inStock) return;
    onAddToCart(
      product,
      selectedSize,
      selectedColor,
      quantity,
      selectedSize === 'Unstitched' ? 'Unstitched' : 'Stitched Pret'
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div
          className="relative w-full max-w-5xl bg-white border border-[#E0DED7] rounded-sm shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Close */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-sm border-b border-[#ECEAE4]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#73716B]">
              <span className="font-semibold text-[#1A1A1A]">{product.category}</span>
              <span aria-hidden="true">/</span>
              <span>{product.pieces}</span>
              <span aria-hidden="true">/</span>
              <span>{product.origin}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'text-red-600 bg-red-50'
                    : 'text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#F2EFE9]'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#F2EFE9] rounded-full transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Two Column Responsive PDP */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Visual Gallery (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Main Large Image */}
                <div className="relative aspect-[3/4] w-full bg-[#F5F4EE] rounded-sm overflow-hidden border border-[#ECEAE4]">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10 text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A] bg-white/95 backdrop-blur-xs px-3 py-1 border border-[#E8E6DF] shadow-xs">
                      {product.badge}
                    </div>
                  )}

                  <img
                    src={images[activeImageIndex]}
                    alt={`${product.name} Pakistani designer detail`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 aspect-[3/4] rounded-sm overflow-hidden border transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                          : 'border-[#E0DED7] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Contiguous Purchase Module (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  {/* Rating & reviews preview */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-[#73716B]">
                    <div className="flex items-center text-[#1A1A1A]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-current text-[#1A1A1A]'
                              : 'text-[#D0CDC4]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-[#1A1A1A]">
                      {product.rating.toFixed(1)}
                    </span>
                    <span>·</span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="underline hover:text-[#1A1A1A] cursor-pointer"
                    >
                      {product.reviewCount} customer reviews
                    </button>
                  </div>

                  {/* Title & Price */}
                  <h2 className="font-serif text-3xl font-medium text-[#1A1A1A] leading-tight text-balance">
                    {product.name}
                  </h2>

                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-mono text-2xl font-semibold tabular-nums text-[#1A1A1A]">
                      {formatPrice(effectivePriceUSD, currency)}
                    </span>
                    {isStitched && (
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Includes Custom Stitched Tailoring
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[#52504C] leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Selector */}
                  <div className="mt-5 pt-5 border-t border-[#ECEAE4]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#73716B] font-mono uppercase tracking-wider">Color:</span>
                      <span className="font-medium text-[#1A1A1A]">{selectedColor.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                            selectedColor.name === c.name
                              ? 'ring-2 ring-[#1A1A1A] ring-offset-2 scale-105'
                              : 'border-[#CCC9BF] hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stitching / Sizing Selector */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-1.5 font-mono uppercase text-[#73716B]">
                        <span>Option:</span>
                        <span className="font-bold text-[#1A1A1A]">
                          {selectedSize === 'Unstitched' ? 'Unstitched 3-Piece' : `Stitched Size ${selectedSize}`}
                        </span>
                      </div>
                      <button
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs text-[#1A1A1A] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Size Chart</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s.size}
                          disabled={!s.inStock}
                          onClick={() => setSelectedSize(s.size)}
                          className={`py-2 px-1 text-xs font-mono border rounded-sm transition-all cursor-pointer text-center ${
                            selectedSize === s.size
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold shadow-xs'
                              : s.inStock
                              ? 'bg-[#FAF9F5] hover:bg-[#F2EFE9] text-[#1A1A1A] border-[#DCDAD2]'
                              : 'bg-transparent text-[#BCB9AF] border-[#E8E6DF] line-through cursor-not-allowed'
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>

                    {/* Stock status indicator */}
                    <div className="mt-2 text-xs font-mono">
                      {currentSizeOption?.inStock ? (
                        <span className="text-emerald-800">
                          • Ready to dispatch · Nationwide COD &amp; DHL Express Available
                        </span>
                      ) : (
                        <span className="text-red-700 font-medium">
                          • Currently out of stock in {selectedSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Primary Add CTA */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex items-center border border-[#DCDAD2] rounded-sm bg-[#FAF9F5]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-3 text-sm hover:bg-[#ECEAE4] transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-bold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-3 text-sm hover:bg-[#ECEAE4] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={!currentSizeOption?.inStock}
                      className={`flex-1 py-3.5 px-6 rounded-sm text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                        addedToast
                          ? 'bg-emerald-800 text-white'
                          : currentSizeOption?.inStock
                          ? 'bg-[#1A1A1A] hover:bg-[#333333] text-[#FAF9F5]'
                          : 'bg-[#E5E3DC] text-[#8C8A84] cursor-not-allowed'
                      }`}
                    >
                      {addedToast ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Shopping Bag</span>
                        </>
                      ) : (
                        <span>
                          {currentSizeOption?.inStock
                            ? `Add to Bag · ${formatPrice(effectivePriceUSD * quantity, currency)}`
                            : 'Sold Out'}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Assurance details */}
                <div className="border-t border-[#ECEAE4] pt-4 space-y-2 text-xs text-[#52504C]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#73716B]" />
                    <span>Free Nationwide Cash on Delivery (COD) across all cities in Pakistan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#73716B]" />
                    <span>14-day hassle-free exchange &amp; return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#73716B]" />
                    <span>100% Genuine Designer Fabric Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion / Tabbed Specifications Section */}
            <div className="mt-10 pt-8 border-t border-[#ECEAE4]">
              <div className="flex items-center gap-6 border-b border-[#E8E6DF] pb-3 text-sm font-medium overflow-x-auto">
                {(
                  [
                    { id: 'includes', label: 'Package Includes' },
                    { id: 'embroidery', label: 'Embroidery & Craft' },
                    { id: 'shipping', label: 'Delivery & COD' },
                    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 relative -mb-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                        : 'text-[#73716B] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-6 text-sm text-[#52504C] leading-relaxed">
                {activeTab === 'includes' && (
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#1A1A1A] font-bold">
                      <Package className="w-4 h-4" />
                      <span>Complete Suite Inclusions:</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm">
                      {product.includes.map((item, idx) => (
                        <li key={idx} className="text-[#333333] font-medium">{item}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-[#73716B] pt-2">
                      * Fabric is sufficient to stitch shirt lengths up to 48 inches and loose flared shalwars or cigarette trousers.
                    </p>
                  </div>
                )}

                {activeTab === 'embroidery' && (
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#1A1A1A] font-bold">
                      <Sparkles className="w-4 h-4 text-[#C2A382]" />
                      <span>Artisanal Needlework:</span>
                    </div>
                    <p><strong>Embroidery Technique:</strong> {product.embroideryDetails}</p>
                    <p><strong>Fabric Composition:</strong> {product.material}</p>
                    <p><strong>Care Instruction:</strong> {product.care}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-3 max-w-2xl">
                    <p><strong>Pakistan Domestic:</strong> 2-3 working days via TCS / Leopards Courier. Cash on Delivery (COD) accepted nationwide.</p>
                    <p><strong>Overseas Delivery:</strong> 3-5 business days via DHL Express to United Kingdom, United States, UAE, Canada, and Australia.</p>
                    <p><strong>Custom Stitched Orders:</strong> Please allow 5-7 additional working days for master tailoring and finishing.</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm">
                      <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
                        {product.rating.toFixed(1)}
                      </div>
                      <div>
                        <div className="flex items-center text-[#1A1A1A]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <div className="text-xs text-[#73716B] font-mono mt-0.5">
                          Based on {product.reviewCount} authenticated client purchases
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {product.reviews.map((r) => (
                        <div key={r.id} className="p-4 border border-[#ECEAE4] rounded-sm space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                              <span>{r.author}</span>
                              {r.location && <span className="text-[#73716B] font-mono">({r.location})</span>}
                              {r.verified && (
                                <span className="text-[10px] text-emerald-800 font-mono">
                                  ✓ Verified Client
                                </span>
                              )}
                            </div>
                            <span className="text-[#8C8A84] font-mono">{r.date}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#1A1A1A]">{r.headline}</h4>
                          <p className="text-xs text-[#52504C]">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </>
  );
}
