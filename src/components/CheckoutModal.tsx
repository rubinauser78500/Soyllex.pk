import { useState } from 'react';
import { X, ShieldCheck, Truck, CreditCard, Banknote, Printer, ChevronRight, PackageCheck, Sparkles } from 'lucide-react';
import { CartItem, CurrencyConfig, OrderDetails } from '../types/store';
import { formatPrice, calculateSubtotal } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  discountPercent: number;
  discountCode: string;
  onOrderCompleted: (order: OrderDetails) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  currency,
  discountPercent,
  discountCode,
  onOrderCompleted,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan',
  });

  const [shippingMethod, setShippingMethod] = useState<'cod_pakistan' | 'dhl_express'>('cod_pakistan');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'bank_transfer'>('cod');
  const [cardData] = useState({
    number: '•••• •••• •••• 5124',
    name: 'AYESHA MALIK',
    expiry: '11/28',
    cvv: '•••',
  });
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  // Subtotals
  const subtotalUSD = calculateSubtotal(items);
  const discountUSD = (subtotalUSD * discountPercent) / 100;
  const isFreeDomesticShipping = formData.country === 'Pakistan';
  const shippingCostUSD =
    formData.country === 'Pakistan'
      ? (subtotalUSD >= 50 ? 0 : 5)
      : shippingMethod === 'dhl_express'
      ? 28
      : 20;
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingCostUSD);

  const handleAutofillPakistan = () => {
    setFormData({
      fullName: 'Ayesha Malik',
      email: 'ayesha.malik@lahore.pk',
      phone: '+92 300 8472910',
      address: 'House 42, Block L, Phase 5, DHA',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54792',
      country: 'Pakistan',
    });
    setShippingMethod('cod_pakistan');
    setPaymentMethod('cod');
  };

  const handleAutofillOverseas = () => {
    setFormData({
      fullName: 'Zahra Farooq',
      email: 'zahra.farooq@outlook.co.uk',
      phone: '+44 7700 900382',
      address: '18 Kensington Church Street',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W8 4EP',
      country: 'United Kingdom',
    });
    setShippingMethod('dhl_express');
    setPaymentMethod('card');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address || !formData.city) return;
    setStep('payment');
  };

  const handleCompleteOrder = () => {
    const orderNumber = `NOOR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderDetails = {
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      customer: { ...formData },
      items: [...items],
      subtotalUSD,
      discountUSD,
      shippingUSD: shippingCostUSD,
      totalUSD,
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Cash on Delivery (TCS / Leopards Pakistan)'
          : paymentMethod === 'card'
          ? 'Credit / Debit Card (Visa / Mastercard)'
          : 'Direct Online Bank Transfer (HBL / Meezan)',
      currency: currency.code,
      currencyRate: currency.rate,
      currencySymbol: currency.symbol,
    };

    setConfirmedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white border border-[#E0DED7] rounded-sm shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEAE4] bg-[#FAF9F5]">
          <div>
            <span className="font-serif text-lg font-bold tracking-widest text-[#1A1A1A] uppercase">
              Noor-e-Atelier
            </span>
            <span className="text-xs text-[#73716B] font-mono ml-3">
              {step === 'confirmation' ? 'Order Confirmed' : 'Secure Checkout & Delivery'}
            </span>
          </div>

          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-1 text-[#73716B] hover:text-[#1A1A1A] rounded-sm transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-step progress bar */}
        {step !== 'confirmation' && (
          <div className="grid grid-cols-2 text-center text-xs font-mono border-b border-[#ECEAE4]">
            <div
              className={`py-2.5 transition-colors ${
                step === 'shipping'
                  ? 'bg-[#1A1A1A] text-white font-semibold'
                  : 'bg-[#F2EFE9] text-[#73716B]'
              }`}
            >
              1. Delivery &amp; Contact Details
            </div>
            <div
              className={`py-2.5 transition-colors ${
                step === 'payment'
                  ? 'bg-[#1A1A1A] text-white font-semibold'
                  : 'bg-[#F2EFE9] text-[#73716B]'
              }`}
            >
              2. Payment &amp; Review
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* STEP 1: SHIPPING & ADDRESS */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#ECEAE4] gap-2">
                <h3 className="font-serif text-xl text-[#1A1A1A]">Client &amp; Delivery Destination</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutofillPakistan}
                    className="text-xs font-mono text-[#1A1A1A] bg-[#F2EFE9] hover:bg-[#E8E5DC] px-2.5 py-1 rounded-sm transition-colors cursor-pointer"
                  >
                    🇵🇰 Autofill Pakistan (COD)
                  </button>
                  <button
                    type="button"
                    onClick={handleAutofillOverseas}
                    className="text-xs font-mono text-[#1A1A1A] bg-[#F2EFE9] hover:bg-[#E8E5DC] px-2.5 py-1 rounded-sm transition-colors cursor-pointer"
                  >
                    🇬🇧 Overseas (UK)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="e.g. Ayesha Malik"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="ayesha@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Complete Street Address / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="House 42, Block L, Phase 5, DHA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="Lahore, Karachi, Islamabad..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="54000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setFormData({ ...formData, country: newCountry });
                      if (newCountry === 'Pakistan') {
                        setShippingMethod('cod_pakistan');
                        setPaymentMethod('cod');
                      } else {
                        setShippingMethod('dhl_express');
                        setPaymentMethod('card');
                      }
                    }}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="Pakistan">Pakistan (Nationwide COD)</option>
                    <option value="United Kingdom">United Kingdom (DHL Express)</option>
                    <option value="United States">United States (DHL Express)</option>
                    <option value="United Arab Emirates">United Arab Emirates (DHL Express)</option>
                    <option value="Canada">Canada (DHL Express)</option>
                    <option value="Australia">Australia (DHL Express)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#73716B] mb-1">
                    Mobile Phone (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#DCDAD2] rounded-sm text-sm focus:outline-none focus:border-[#1A1A1A]"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              {/* Shipping Tier Selection */}
              <div className="pt-4 border-t border-[#ECEAE4]">
                <h4 className="font-serif text-lg text-[#1A1A1A] mb-3">Courier Service</h4>
                <div className="space-y-2.5">
                  {formData.country === 'Pakistan' ? (
                    <label
                      onClick={() => setShippingMethod('cod_pakistan')}
                      className="flex items-center justify-between p-3.5 border rounded-sm cursor-pointer transition-all border-[#1A1A1A] bg-[#FAF9F5]"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={shippingMethod === 'cod_pakistan'}
                          onChange={() => setShippingMethod('cod_pakistan')}
                          className="accent-[#1A1A1A]"
                        />
                        <div>
                          <div className="font-medium text-sm text-[#1A1A1A]">
                            TCS / Leopards Nationwide Cash on Delivery
                          </div>
                          <div className="text-xs text-[#73716B]">2-3 working days · Pay cash upon delivery</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums text-emerald-800">
                        {subtotalUSD >= 50 ? 'Complimentary' : formatPrice(5, currency)}
                      </span>
                    </label>
                  ) : (
                    <label
                      onClick={() => setShippingMethod('dhl_express')}
                      className="flex items-center justify-between p-3.5 border rounded-sm cursor-pointer transition-all border-[#1A1A1A] bg-[#FAF9F5]"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={shippingMethod === 'dhl_express'}
                          onChange={() => setShippingMethod('dhl_express')}
                          className="accent-[#1A1A1A]"
                        />
                        <div>
                          <div className="font-medium text-sm text-[#1A1A1A]">
                            DHL Worldwide Express Courier
                          </div>
                          <div className="text-xs text-[#73716B]">3-5 working days · Fully tracked with signature</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums">
                        {formatPrice(28, currency)}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-sm font-medium tracking-wide rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Continue to Payment Method</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT & ORDER REVIEW */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECEAE4]">
                <div>
                  <h3 className="font-serif text-xl text-[#1A1A1A]">Payment Protocol</h3>
                  <p className="text-xs text-[#73716B]">
                    Delivering to: {formData.fullName}, {formData.city}, {formData.country}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-mono text-[#1A1A1A] underline cursor-pointer"
                >
                  Edit details
                </button>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 border rounded-sm text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#1A1A1A] bg-[#FAF9F5] shadow-xs'
                      : 'border-[#E0DED7] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <Banknote className="w-4 h-4 mb-1.5 text-[#1A1A1A]" />
                  <div className="text-xs font-semibold text-[#1A1A1A]">Cash on Delivery</div>
                  <div className="text-[10px] text-[#73716B]">Pay rider at doorstep</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 border rounded-sm text-left transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#1A1A1A] bg-[#FAF9F5] shadow-xs'
                      : 'border-[#E0DED7] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1.5 text-[#1A1A1A]" />
                  <div className="text-xs font-semibold text-[#1A1A1A]">Credit / Debit Card</div>
                  <div className="text-[10px] text-[#73716B]">Visa, Mastercard, PayPak</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 border rounded-sm text-left transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#1A1A1A] bg-[#FAF9F5] shadow-xs'
                      : 'border-[#E0DED7] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mb-1.5 text-[#1A1A1A]" />
                  <div className="text-xs font-semibold text-[#1A1A1A]">Online Bank IBFT</div>
                  <div className="text-[10px] text-[#73716B]">Meezan / HBL / Raast</div>
                </button>
              </div>

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm text-xs text-[#52504C] space-y-1.5">
                  <p className="font-semibold text-[#1A1A1A]">Cash on Delivery (Pakistan Nationwide):</p>
                  <p>
                    • Total payable at delivery doorstep in cash:{' '}
                    <strong className="text-base font-mono text-[#1A1A1A]">{formatPrice(totalUSD, currency)}</strong>.
                  </p>
                  <p>• Our courier partner (TCS / Leopards) will send an SMS dispatch tracking link before arrival.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono text-[#73716B]">
                    <span>Card Information</span>
                    <span className="text-emerald-800">256-Bit SSL Protected</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={cardData.number}
                      className="w-full p-2.5 bg-white border border-[#DCDAD2] rounded-sm text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      readOnly
                      value={cardData.expiry}
                      className="w-full p-2.5 bg-white border border-[#DCDAD2] rounded-sm text-xs font-mono"
                    />
                    <input
                      type="text"
                      readOnly
                      value={cardData.cvv}
                      className="w-full p-2.5 bg-white border border-[#DCDAD2] rounded-sm text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm text-xs text-[#52504C] space-y-1">
                  <p className="font-semibold text-[#1A1A1A]">Direct IBFT Account Details:</p>
                  <p>• Bank: Meezan Bank Ltd (Gulberg Branch, Lahore)</p>
                  <p>• Account Title: Noor-e-Atelier Pakistan Private Ltd</p>
                  <p>• IBAN: PK64MEZN0001020304050607</p>
                  <p>• WhatsApp payment screenshot to: +92 300 8472910</p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="pt-4 border-t border-[#ECEAE4] space-y-2 text-xs font-mono text-[#52504C]">
                <div className="flex justify-between">
                  <span>Garments Subtotal ({items.length})</span>
                  <span>{formatPrice(subtotalUSD, currency)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount ({discountCode})</span>
                    <span>-{formatPrice(discountUSD, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({formData.country === 'Pakistan' ? 'TCS Ground' : 'DHL Express'})</span>
                  <span>
                    {shippingCostUSD === 0 ? 'Complimentary' : formatPrice(shippingCostUSD, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#ECEAE4]">
                  <span>Total Payable</span>
                  <span className="tabular-nums font-mono text-lg">
                    {formatPrice(totalUSD, currency)}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-[#333333] text-white text-sm font-medium tracking-wide rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Confirm &amp; Place Order · {formatPrice(totalUSD, currency)}</span>
              </button>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <PackageCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#73716B]">
                  Shukriya · Order Confirmed
                </span>
                <h3 className="font-serif text-3xl font-medium text-[#1A1A1A] mt-1">
                  Mubarak! Your Order is Received
                </h3>
                <p className="text-xs font-mono text-[#1A1A1A] font-bold mt-2">
                  Order Reference: {confirmedOrder.orderNumber}
                </p>
                <p className="text-sm text-[#66635D] max-w-md mx-auto mt-1">
                  Confirmation SMS and receipt sent to{' '}
                  <strong>{confirmedOrder.customer.phone}</strong> &amp;{' '}
                  <strong>{confirmedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF9F5] border border-[#E8E6DF] rounded-sm p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="text-xs font-mono uppercase text-[#73716B] pb-2 border-b border-[#ECEAE4]">
                  Order Receipt Breakdown
                </div>

                <div className="divide-y divide-[#ECEAE4] max-h-48 overflow-y-auto">
                  {confirmedOrder.items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-medium text-[#1A1A1A]">{item.product.name}</div>
                        <div className="text-[#73716B] font-mono text-[11px]">
                          {item.selectedSize === 'Unstitched' ? 'Unstitched 3-Piece' : `Size ${item.selectedSize}`} · {item.selectedColor.name} · Qty {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono font-medium text-[#1A1A1A]">
                        {formatPrice(item.unitPriceUSD * item.quantity, currency)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#ECEAE4] flex justify-between text-xs font-mono">
                  <span className="text-[#73716B]">Payment Method:</span>
                  <span className="text-[#1A1A1A] font-medium">{confirmedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#73716B]">Destination:</span>
                  <span className="text-[#1A1A1A] font-medium">
                    {confirmedOrder.customer.city}, {confirmedOrder.customer.country}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold font-mono text-[#1A1A1A] pt-1">
                  <span>Total Payable:</span>
                  <span>{formatPrice(confirmedOrder.totalUSD, currency)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-5 border border-[#CCC9BF] hover:bg-[#F2EFE9] text-xs font-medium rounded-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Order Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium rounded-sm transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
