import type { Souvenir, DbSouvenir, SouvenirInput } from './types';
import type { CategorySlug } from './categories';
import { CATEGORIES } from './categories';

const VALID_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));

function toCategory(raw: string): CategorySlug {
  return (VALID_SLUGS.has(raw) ? raw : 'general') as CategorySlug;
}

export function dbSouvenirToSouvenir(row: DbSouvenir): Souvenir {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: toCategory(row.category),
    shortDescription: row.short_description,
    longDescription: row.long_description,
    price: row.price,
    showPrice: row.show_price,
    coverImage: row.cover_image,
    detailImage2: row.detail_image_2,
    detailImage3: row.detail_image_3,
    artisanCredit: row.artisan_credit,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function souvenirInputToDb(
  input: SouvenirInput,
): Omit<DbSouvenir, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {
  return {
    slug: input.slug,
    name: input.name,
    category: input.category,
    short_description: input.shortDescription,
    long_description: input.longDescription,
    price: input.price,
    show_price: input.showPrice,
    cover_image: input.coverImage,
    detail_image_2: input.detailImage2,
    detail_image_3: input.detailImage3,
    artisan_credit: input.artisanCredit,
    is_active: input.isActive,
    sort_order: input.sortOrder,
  };
}
