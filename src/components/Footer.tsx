import { useState } from 'react';
import { ArrowRight, Check, Phone } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#1A1A1A] text-[#FAF9F5] pt-16 pb-12 border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#333333]">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] font-semibold uppercase text-white block">
              Noor-e-Atelier
            </span>
            <p className="text-xs text-[#A3A199] leading-relaxed max-w-sm">
              Luxury Pakistani ladies pret and couture. Celebrating heirloom Mughal embroidery, superfine Swiss lawn, and pure mulberry silk dupattas with nationwide COD and express overseas delivery.
            </p>
            <div className="text-[11px] font-mono text-[#8C8A84] space-y-1">
              <div>Lahore Flagship: M.M. Alam Road, Gulberg III, Lahore, Pakistan</div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Concierge: +92 300 8472910</span>
              </div>
            </div>
          </div>

          {/* Nav Collections (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono tracking-wider uppercase text-[#8C8A84]">Collections</div>
            <ul className="space-y-2 text-xs text-[#CCCCCC]">
              <li><a href="#catalog" className="hover:text-white transition-colors">Eid &amp; Summer Capsule</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Embroidered Swiss Lawn</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Ready-to-Wear Pret</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Festive &amp; Formal Shararas</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Pure Silk Dupattas</a></li>
            </ul>
          </div>

          {/* Client Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono tracking-wider uppercase text-[#8C8A84]">Client Services</div>
            <ul className="space-y-2 text-xs text-[#CCCCCC]">
              <li><span className="cursor-pointer hover:text-white transition-colors">Custom Tailoring &amp; Stitching</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Cash on Delivery (Pakistan)</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Overseas DHL Express Delivery</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">14-Day Easy Exchange Policy</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Garment Preservation &amp; Care</span></li>
            </ul>
          </div>

          {/* Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono tracking-wider uppercase text-[#8C8A84]">Atelier Invitations</div>
            <p className="text-xs text-[#A3A199]">
              Receive private invitations to unstitched lawn pre-bookings and festive collection drops.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#262626] border border-emerald-700/60 rounded-sm flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>You are subscribed to Noor-e-Atelier previews.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email for lawn alerts"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#262626] border border-[#404040] text-xs text-white placeholder-[#73716B] rounded-sm focus:outline-none focus:border-white font-mono"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3 py-2 bg-white text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors rounded-sm cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#73716B] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Noor-e-Atelier Pakistan. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms &amp; Exchange</span>
            <span aria-hidden="true">·</span>
            <span>FBR Registered &amp; Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
