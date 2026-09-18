/**
 * Represents a single artwork listed for sale in the CommisioNyx marketplace.
 */
export interface Artwork {
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  category: string;
  style: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
  featured: boolean;
  medium: string;
  dimensions: string;
  year: number;
  licence: string;
}
