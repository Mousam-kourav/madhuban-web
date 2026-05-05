import type { CategorySlug } from './categories';

export type { CategorySlug };

export type Souvenir = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string | null;
  longDescription: string | null;
  price: number | null;
  showPrice: boolean;
  coverImage: string | null;
  detailImage2: string | null;
  detailImage3: string | null;
  artisanCredit: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SouvenirInput = Omit<Souvenir, 'id' | 'createdAt' | 'updatedAt'>;

export type DbSouvenir = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string | null;
  long_description: string | null;
  price: number | null;
  show_price: boolean;
  cover_image: string | null;
  detail_image_2: string | null;
  detail_image_3: string | null;
  artisan_credit: string | null;
  is_active: boolean;
  deleted_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
