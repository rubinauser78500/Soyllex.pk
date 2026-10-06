import { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
}

export function ProductCard({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const displayImage = hovered && product.secondaryImage ? product.secondaryImage : product.image;

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#ECEAE4] rounded-sm overflow-hidden transition-all duration-300 hover:border-[#D6D3C9] hover:shadow-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* Visual Canvas (65-75% height) */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F4EE] overflow-hidden">
        {/* Editorial subtle text badge if present */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A] bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#E8E6DF]/80 shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Pieces Tag */}
        <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A] bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-[#E8E6DF]/60">
          {product.pieces}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white/80 hover:bg-white text-[#4A4844] hover:text-[#1A1A1A] shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image with Fallback */}
        {!imageError ? (
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EFECE6] p-6 text-center">
            <span className="font-serif text-lg text-[#1A1A1A] mb-1">{product.name}</span>
            <span className="text-xs text-[#73716B] font-mono">{product.category}</span>
          </div>
        )}

        {/* Quick View & Quick Add Overlays on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!showSizePicker ? (
            <div className="flex gap-2">
              <button
                onClick={() => onQuickView(product)}
                className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-sm hover:bg-white text-[#1A1A1A] text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 border border-[#E0DED7] shadow-xs transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#595752]" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => setShowSizePicker(true)}
                className="py-2 px-3 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Quick Add to Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          ) : (
            /* Quick Size Selector */
            <div className="bg-white/95 backdrop-blur-sm border border-[#E0DED7] p-2 shadow-md">
              <div className="text-[10px] font-mono text-[#73716B] mb-1.5 text-center">
                Select Option:
              </div>
              <div className="flex items-center justify-center gap-1 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={!s.inStock}
                    onClick={() => {
                      onQuickAdd(product, s.size);
                      setShowSizePicker(false);
                    }}
                    className={`px-2 py-1 text-xs font-mono transition-colors ${
                      s.inStock
                        ? 'bg-[#F2EFE9] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] cursor-pointer'
                        : 'bg-transparent text-[#B5B3AA] line-through cursor-not-allowed'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Surface */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-2.5">
        <div>
          {/* Zero-Pill Clean Category & Origin Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#73716B] font-mono">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.origin.split(',')[1] || product.origin}</span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="text-left font-serif text-lg font-medium text-[#1A1A1A] group-hover:text-[#4A4844] transition-colors leading-snug pt-0.5 line-clamp-1 cursor-pointer"
          >
            {product.name}
          </button>

          <p className="text-xs text-[#66635D] line-clamp-1 font-light pt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Color Swatches and Price */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE9]">
          {/* Color dots */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, index) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(index);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === index
                    ? 'ring-1 ring-[#1A1A1A] ring-offset-1 scale-110'
                    : 'border-[#CCC9BF] hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Color ${color.name}`}
              />
            ))}
          </div>

          {/* Tabular Numerals Price Baseline */}
          <div className="font-mono text-sm font-semibold tabular-nums text-[#1A1A1A]">
            {formatPrice(product.priceUSD, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
