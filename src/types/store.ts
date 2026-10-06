export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'EUR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export type Category =
  | 'All'
  | 'Embroidered Lawn'
  | 'Luxury Pret'
  | 'Festive & Formal'
  | 'Chikankari'
  | 'Raw Silk'
  | 'Dupattas & Shawls';

export type Gender = 'All' | 'Women' | 'Girls';

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface SizeOption {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Unstitched';
  inStock: boolean;
  stockCount: number;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  headline: string;
  comment: string;
  verified: boolean;
  fitAssessment: 'True to Size' | 'Runs Slightly Large' | 'Runs Slightly Small';
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  gender: Gender;
  pieces: '3 Piece' | '2 Piece' | '1 Piece' | 'Ready to Wear';
  priceUSD: number;
  originalPriceUSD?: number;
  badge?: string;
  image: string;
  secondaryImage?: string;
  colors: ColorVariant[];
  sizes: SizeOption[];
  material: string;
  origin: string;
  description: string;
  embroideryDetails: string;
  includes: string[];
  fit: string;
  care: string;
  sustainability: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique combo of product.id + size + color + stitching
  productId: string;
  product: Product;
  selectedColor: ColorVariant;
  selectedSize: string;
  stitchingOption?: 'Unstitched' | 'Stitched Pret';
  quantity: number;
  unitPriceUSD: number;
}

export interface FilterState {
  category: Category;
  gender: Gender;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStockOnly: boolean;
  maxPriceUSD: number;
}

export interface OrderDetails {
  orderNumber: string;
  date: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  totalUSD: number;
  paymentMethod: string;
  currency: CurrencyCode;
  currencyRate: number;
  currencySymbol: string;
}
