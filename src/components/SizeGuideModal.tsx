import { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', chest: '36', waist: '32', hip: '38', shoulder: '14.0', shirtLength: '42', trouserLength: '37' },
    { size: 'S', chest: '38', waist: '34', hip: '40', shoulder: '14.5', shirtLength: '43', trouserLength: '38' },
    { size: 'M', chest: '41', waist: '37', hip: '43', shoulder: '15.0', shirtLength: '44', trouserLength: '39' },
    { size: 'L', chest: '44', waist: '40', hip: '46', shoulder: '15.5', shirtLength: '45', trouserLength: '39' },
    { size: 'XL', chest: '47', waist: '43', hip: '49', shoulder: '16.0', shirtLength: '45', trouserLength: '40' },
  ];

  const toCm = (valInInches: string) => {
    const num = parseFloat(valInInches);
    return isNaN(num) ? valInInches : Math.round(num * 2.54).toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#E0DED7] rounded-sm p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E8E6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#73716B]">
              <Ruler className="w-3.5 h-3.5" />
              <span>Pakistani Ladies Sizing Guide</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] mt-1">
              Standard Stitched Dimensions · {category}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#73716B] hover:text-[#1A1A1A] transition-colors rounded-sm cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between my-4">
          <p className="text-xs text-[#66635D]">
            Measurements represent the finished stitched garment dimensions.
          </p>
          <div className="flex items-center bg-[#F2EFE9] p-0.5 rounded-sm">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                unit === 'in' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#66635D] hover:text-[#1A1A1A]'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                unit === 'cm' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#66635D] hover:text-[#1A1A1A]'
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E8E6DF] rounded-sm">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[#1A1A1A] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Chest (Kurta)</th>
                <th className="py-3 px-3">Waist</th>
                <th className="py-3 px-3">Hip Flare</th>
                <th className="py-3 px-3">Shoulder</th>
                <th className="py-3 px-3">Shirt Length</th>
                <th className="py-3 px-3">Trouser Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF]">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#1A1A1A]">{row.size}</td>
                  <td className="py-2.5 px-3 text-[#1A1A1A]">
                    {unit === 'in' ? `${row.chest}"` : `${toCm(row.chest)} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1A1A1A]">
                    {unit === 'in' ? `${row.waist}"` : `${toCm(row.waist)} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1A1A1A]">
                    {unit === 'in' ? `${row.hip}"` : `${toCm(row.hip)} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#66635D]">
                    {unit === 'in' ? `${row.shoulder}"` : `${toCm(row.shoulder)} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1A1A1A]">
                    {unit === 'in' ? `${row.shirtLength}"` : `${toCm(row.shirtLength)} cm`}
                  </td>
                  <td className="py-2.5 px-3 text-[#1A1A1A]">
                    {unit === 'in' ? `${row.trouserLength}"` : `${toCm(row.trouserLength)} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-5 p-3.5 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm text-xs text-[#52504C] space-y-1.5">
          <p className="font-semibold text-[#1A1A1A]">Unstitched vs. Stitched Option:</p>
          <p>
            • <strong>Unstitched 3-Piece:</strong> Includes generous fabric (3.25m shirt, 2.5m trouser, 2.5m dupatta) plus all embroidered necklines, daman borders, and sleeves patches ready for your personal master tailor.
          </p>
          <p>
            • <strong>Custom Stitched Pret:</strong> Expertly tailored by our Lahore master tailors with premium cotton lining, finished piping, buttons, and matching cigarette trousers.
          </p>
        </div>
      </div>
    </div>
  );
}
