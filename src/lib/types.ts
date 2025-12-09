import type { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: 'Swiss' | 'Japanese' | 'Other';
  description: string;
  longDescription: string;
  price: number;
  image: (typeof PlaceHolderImages)[number];
  isTrending: boolean;
  brand: string;
  modelType?: 'Professional' | 'Classic';
};

export type CartItem = Product & {
  quantity: number;
};

export type Category = {
  name: 'Swiss' | 'Japanese' | 'Other';
  description: string;
  image: (typeof PlaceHolderImages)[number];
};

export type Brand = {
    name: string;
    slug: string;
    category: 'Swiss' | 'Japanese' | 'Other';
}
