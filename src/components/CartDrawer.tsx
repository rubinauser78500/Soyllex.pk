import { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types/store';
import { formatPrice, calculateSubtotal } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  discountCode: string;
  discountPercent: number;
  onApplyDiscount: (code: string) => boolean;
}

const FREE_SHIPPING_THRESHOLD_USD = 150;

export function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountCode,
  discountPercent,
  onApplyDiscount,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotalUSD = calculateSubtotal(items);
  const discountAmountUSD = (subtotalUSD * discountPercent) / 100;
  const isFreeShipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD || discountCode === 'FREESHIP';
  const shippingUSD = items.length === 0 ? 0 : isFreeShipping ? 0 : 25;
  const totalUSD = Math.max(0, subtotalUSD - discountAmountUSD + shippingUSD);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotalUSD);
  const progressPercent = Math.min(100, (subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyDiscount(promoInput.trim().toUpperCase());
    if (success) {
      setPromoMessage({ text: 'Promo code applied successfully!', error: false });
    } else {
      setPromoMessage({ text: 'Invalid code. Try "ATELIER15" for 15% off.', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E6DF] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#ECEAE4] flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1A1A1A]" />
              <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#73716B] hover:text-[#1A1A1A] hover:bg-[#EFECE6] rounded-sm transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF9F5] px-5 py-3 border-b border-[#ECEAE4]">
            <div className="flex items-center justify-between text-xs font-mono text-[#52504C] mb-1.5">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong>{formatPrice(amountToFreeShipping, currency)}</strong> for complimentary priority delivery
                </span>
              ) : (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  You unlocked complimentary priority worldwide delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-[#E8E6DF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1A1A1A] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F5F4EE] flex items-center justify-center text-[#73716B]">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Your bag is empty</h3>
                <p className="text-xs text-[#73716B] max-w-xs">
                  Discover our architectural tailoring, fine knitwear, and seasonal garments.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 py-2 px-4 bg-[#1A1A1A] text-white text-xs font-medium rounded-sm hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-[#ECEAE4] items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-[#F5F4EE] rounded-sm overflow-hidden shrink-0 border border-[#ECEAE4]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base font-medium text-[#1A1A1A] truncate pr-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#8C8A84] hover:text-red-700 p-1 transition-colors cursor-pointer"
                        title="Remove garment"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[#66635D] font-mono">
                      <span>Size {item.selectedSize}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DCDAD2] rounded-sm bg-[#FAF9F5]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs hover:bg-[#ECEAE4] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs hover:bg-[#ECEAE4] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Tabular Price */}
                      <span className="font-mono text-sm font-semibold tabular-nums text-[#1A1A1A]">
                        {formatPrice(item.unitPriceUSD * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#ECEAE4] bg-[#FAF9F5] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8A84]" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. ATELIER15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#DCDAD2] text-xs font-mono uppercase rounded-sm focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#FAF9F5] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs font-mono transition-colors rounded-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-mono ${
                      promoMessage.error ? 'text-red-700' : 'text-emerald-800 font-semibold'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs font-mono text-[#52504C] pt-2 border-t border-[#E8E6DF]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1A1A1A]">
                    {formatPrice(subtotalUSD, currency)}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount ({discountCode} - {discountPercent}%)</span>
                    <span className="tabular-nums">-{formatPrice(discountAmountUSD, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="tabular-nums">
                    {shippingUSD === 0 ? 'Complimentary' : formatPrice(shippingUSD, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#E8E6DF]">
                  <span>Total Due</span>
                  <span className="tabular-nums font-mono text-base">
                    {formatPrice(totalUSD, currency)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#1A1A1A] hover:bg-[#333333] text-white text-sm font-medium tracking-wide rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#73716B]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>SSL Encrypted Checkout · 30-Day Guaranteed Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
