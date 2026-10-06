import { useState } from 'react';
import { LOOKBOOK_IMAGE, LOOKBOOK_HOTSPOTS } from '../data/products';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';
import { ArrowUpRight, Plus, Sparkles } from 'lucide-react';

interface LookbookSectionProps {
  products: Product[];
  currency: CurrencyConfig;
  onOpenProduct: (product: Product) => void;
}

export function LookbookSection({ products, currency, onOpenProduct }: LookbookSectionProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string>('hotspot-1');
  const [imgError, setImgError] = useState(false);

  const getProduct = (productId: string) => products.find((p) => p.id === productId);

  return (
    <section id="lookbook" className="w-full bg-[#FAF9F5] py-16 sm:py-24 border-b border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#73716B] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A382]" />
            <span>Festive Editorial · SS26</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] mt-2 leading-tight">
            Shehnai &amp; Sharara: The Festive Lookbook
          </h2>
          <p className="text-sm sm:text-base text-[#615F5B] mt-3 font-light leading-relaxed">
            Styled with Pakistani royal court silhouettes, voluminous banarsi jacquard shararas, and delicate tilla peplums. Tap any pinned detail to shop the festive ensemble.
          </p>
        </div>

        {/* Lookbook Layout: Split visual with interactive hotspot canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual with Hotspots (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-sm overflow-hidden bg-[#EFECE6] border border-[#E0DED7] shadow-sm">
              {!imgError ? (
                <img
                  src={LOOKBOOK_IMAGE}
                  alt="Noor-e-Atelier Pakistani Festive Sharara Lookbook Editorial"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#E5E2D9]">
                  <span className="font-serif text-2xl text-[#1A1A1A]">FESTIVE CAPSULE</span>
                  <span className="text-xs font-mono text-[#73716B] mt-2">Pakistani Ladies Couture</span>
                </div>
              )}

              {/* Interactive Hotspot Dots */}
              {LOOKBOOK_HOTSPOTS.map((hotspot) => {
                const isActive = activeHotspotId === hotspot.id;
                const prod = getProduct(hotspot.productId);

                return (
                  <div
                    key={hotspot.id}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: hotspot.top, left: hotspot.left }}
                  >
                    <button
                      onClick={() => setActiveHotspotId(hotspot.id)}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white ring-4 ring-white/60 scale-110 shadow-lg'
                          : 'bg-white/90 text-[#1A1A1A] hover:bg-white shadow-md'
                      }`}
                      aria-label={`Hotspot for ${hotspot.title}`}
                    >
                      <Plus className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`} />
                    </button>

                    {/* Popover Card directly over hotspot on desktop */}
                    {isActive && prod && (
                      <div className="hidden sm:block absolute left-10 top-0 -translate-y-1/2 w-64 bg-white/95 backdrop-blur-md border border-[#E0DED7] p-3 rounded-sm shadow-xl z-30">
                        <div className="text-[10px] font-mono text-[#73716B] uppercase">{prod.category}</div>
                        <div className="font-serif text-base font-semibold text-[#1A1A1A]">{prod.name}</div>
                        <div className="font-mono text-xs font-bold text-[#1A1A1A] mt-1 tabular-nums">
                          {formatPrice(prod.priceUSD, currency)}
                        </div>
                        <button
                          onClick={() => onOpenProduct(prod)}
                          className="mt-2.5 w-full py-1.5 px-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Inspect Garment</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adjacent Shop-the-Look Item Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#73716B]">
              Ensemble Details &amp; Pieces ({LOOKBOOK_HOTSPOTS.length})
            </div>

            <div className="space-y-3">
              {LOOKBOOK_HOTSPOTS.map((hotspot, idx) => {
                const prod = getProduct(hotspot.productId);
                if (!prod) return null;
                const isSelected = activeHotspotId === hotspot.id;

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => setActiveHotspotId(hotspot.id)}
                    className={`p-4 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#1A1A1A] shadow-xs'
                        : 'bg-[#F5F4EE]/70 hover:bg-white border-[#E8E6DF]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-mono flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-[#73716B] uppercase">
                            {prod.category} · {prod.pieces}
                          </div>
                          <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mt-0.5">
                            {prod.name}
                          </h3>
                          <div className="font-mono text-sm font-semibold text-[#1A1A1A] mt-1 tabular-nums">
                            {formatPrice(prod.priceUSD, currency)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProduct(prod);
                        }}
                        className="p-2 text-[#4A4844] hover:text-[#1A1A1A] hover:bg-[#F2EFE9] rounded-sm transition-colors"
                        title="View details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-[#ECEAE4] flex items-center justify-between text-xs">
                        <span className="text-[#66635D]">{prod.material}</span>
                        <button
                          onClick={() => onOpenProduct(prod)}
                          className="font-medium text-[#1A1A1A] underline hover:no-underline"
                        >
                          Shop Garment →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Editorial Quote */}
            <div className="mt-8 p-6 bg-white border border-[#E0DED7] rounded-sm">
              <blockquote className="font-serif italic text-lg text-[#262422] leading-relaxed">
                “Pakistani couture celebrates centuries of Mughal aesthetics: the flutter of pure silk dupattas, the crisp resonance of Swiss lawn, and the heirloom gleam of real zardozi needlework.”
              </blockquote>
              <div className="mt-3 text-xs font-mono text-[#73716B] uppercase">
                Creative Director · Noor-e-Atelier Lahore
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
