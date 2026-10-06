import { Scissors, Sparkles, Feather, ShieldCheck } from 'lucide-react';

export function CraftSection() {
  const pillars = [
    {
      icon: Scissors,
      title: 'Master Karigars & Tailors',
      description:
        'Centuries-old zardozi, dabka, and tilla embroidery traditions handed down through families in the historic walled city of Lahore and artisan quarters of Karachi.',
    },
    {
      icon: Feather,
      title: '80x80 Swiss Pima Lawn',
      description:
        'Spun using ultra-long staple cotton fibers that offer silky breathable hand feel, engineered specifically to stay crisp and cool throughout subcontinental summers.',
    },
    {
      icon: Sparkles,
      title: 'Multani Chikan-Kari & Cutwork',
      description:
        'Intricate tone-on-tone needlework and delicate schiffli lace borders produced on high-precision looms with hand-applied freshwater pearl embellishments.',
    },
    {
      icon: ShieldCheck,
      title: 'Pure Medium Silk Dupattas',
      description:
        '100% natural mulberry silk dupattas printed with botanical Mughal miniatures, finished with hand-rolled hems and traditional silk thread corner tassels.',
    },
  ];

  return (
    <section id="atelier" className="w-full bg-[#F5F4EE] py-16 sm:py-24 border-b border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Header */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#73716B]">
              Textile Heritage &amp; Craft
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight text-balance">
              The Grandeur of Pakistani Artisanal Fashion
            </h2>
            <p className="text-base text-[#52504C] font-light leading-relaxed">
              Every Noor-e-Atelier silhouette honors the legacy of subcontinental needlecraft. We merge heirloom Mughal motifs with refined contemporary silhouettes designed for modern celebrations.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-[#73716B]">
              <div>Lahore Atelier · Gulberg III</div>
              <span aria-hidden="true">·</span>
              <div>Karachi Design Studio · Clifton</div>
            </div>
          </div>

          {/* Right 4 Pillars Grid (Single elevation, zero card spam) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 bg-white border border-[#E8E6DF] rounded-sm transition-all hover:border-[#CCC9BF]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#1A1A1A] mb-4">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#52504C] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
