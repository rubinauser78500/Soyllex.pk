import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: CurrencyConfig;
  onRemoveItem: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onRemoveItem,
  onMoveToBag,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E6DF] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#ECEAE4] flex items-center justify-between bg-[#FAF9F5]">
            <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
              Saved Wishlist ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-[#73716B] hover:text-[#1A1A1A] hover:bg-[#EFECE6] rounded-sm transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F5F4EE] flex items-center justify-center text-[#73716B]">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-[#73716B] max-w-xs">
                  Save your favorite silhouettes and outerwear to revisit anytime.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 py-2 px-4 bg-[#1A1A1A] text-white text-xs font-medium rounded-sm hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Discover Garments
                </button>
              </div>
            ) : (
              items.map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-4 pb-4 border-b border-[#ECEAE4] items-start"
                >
                  <div className="w-20 aspect-[3/4] bg-[#F5F4EE] rounded-sm overflow-hidden shrink-0 border border-[#ECEAE4]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base font-medium text-[#1A1A1A] truncate pr-2">
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(prod.id)}
                        className="text-[#8C8A84] hover:text-red-700 p-1 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-[#73716B] font-mono mt-0.5">
                      {prod.category} · {prod.origin}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold tabular-nums text-[#1A1A1A]">
                        {formatPrice(prod.priceUSD, currency)}
                      </span>

                      <button
                        onClick={() => onMoveToBag(prod)}
                        className="py-1.5 px-3 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Select Size</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
