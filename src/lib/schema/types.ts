/** Shared input types for schema.org generator functions. */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PostalAddress {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface MonetaryAmount {
  value: number;
  currency: string;
}

export interface ImageObject {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}
