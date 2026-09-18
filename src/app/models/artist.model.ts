/**
 * Represents an artist who sells artwork and accepts commissions.
 */
export interface Artist {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  completedCommissions: number;
  rating: number;
  reviews: number;
  startingPrice: number;
  location: string;
  joinedYear: number;
  responseTime: string;
  /** Multiplier applied to commission estimates, based on the artist's reputation. */
  rateMultiplier: number;
}
