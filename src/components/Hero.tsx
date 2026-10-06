import { useState } from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onShopCollection: () => void;
  onExploreLookbook: () => void;
}

export function Hero({ onShopCollection, onExploreLookbook }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative w-full border-b border-[#E8E6DF] bg-[#FAF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Campaign Text (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#73716B] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A382]" />
              <span>Eid &amp; Festive Collection 2026</span>
              <span aria-hidden="true">·</span>
              <span>New Arrivals</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-[#1A1A1A] text-balance">
              Regal Resham. Pure Silk. Timeless Grace.
            </h1>

            <p className="text-base sm:text-lg text-[#52504C] leading-relaxed max-w-lg font-light">
              Introducing our new arrival ladies collection. Luxurious 3-piece embroidered Swiss lawn, handcrafted raw silk kalidars with zardozi dabka work, and cascading digital printed pure silk dupattas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onShopCollection}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A1A1A] text-[#FAF9F5] text-sm font-medium tracking-wide hover:bg-[#333333] transition-colors rounded-sm cursor-pointer shadow-sm group"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreLookbook}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent border border-[#CCC9BF] text-[#1A1A1A] text-sm font-medium tracking-wide hover:bg-[#F2EFE9] transition-colors rounded-sm cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#73716B]" />
                <span>View Festive Lookbook</span>
              </button>
            </div>

            {/* Quiet trust credentials */}
            <div className="pt-4 border-t border-[#E8E6DF] flex flex-wrap items-center gap-4 text-xs text-[#73716B] font-mono">
              <div>Master Karigars of Lahore &amp; Karachi</div>
              <span aria-hidden="true">·</span>
              <div>Free Nationwide COD</div>
              <span aria-hidden="true">·</span>
              <div>Worldwide Express DHL</div>
            </div>
          </div>

          {/* Campaign Visual Focal Point (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#EFECE6] shadow-sm">
              {!imageError ? (
                <img
                  src={HERO_IMAGE}
                  alt="Noor-e-Atelier Pakistani Ladies Festive Campaign 2026"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover object-center transition-all duration-700 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EFECE6] to-[#E3DFD5] p-8 text-center">
                  <span className="font-serif text-2xl text-[#1A1A1A] mb-2">NOOR-E-ATELIER</span>
                  <p className="text-xs text-[#73716B] uppercase tracking-widest font-mono">Pakistani Festive Ladies Capsule</p>
                </div>
              )}

              {/* Clean Editorial Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 sm:right-auto bg-[#FAF9F5]/92 backdrop-blur-sm px-4 py-2.5 rounded-sm border border-[#E8E6DF]/60 text-xs font-mono text-[#4A4844] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-pulse" />
                <span>Plate I — Gul-e-Noor Embroidered Lawn &amp; Pure Silk Dupatta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
