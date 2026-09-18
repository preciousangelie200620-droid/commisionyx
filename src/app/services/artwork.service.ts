import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Artwork } from '../models/artwork.model';
import { Artist } from '../models/artist.model';
import { ARTWORKS } from '../data/artworks.data';
import { ARTISTS } from '../data/artists.data';

/**
 * Supplies the artwork catalogue and the artist list.
 *
 * Everything is held in memory (mock data) but exposed as Observables so that
 * swapping in a real HttpClient later would not change the components.
 */
@Injectable({ providedIn: 'root' })
export class ArtworkService {
  private readonly artworksSubject = new BehaviorSubject<Artwork[]>(ARTWORKS);
  private readonly artistsSubject = new BehaviorSubject<Artist[]>(ARTISTS);

  /** All artworks in the catalogue. */
  getArtworks(): Observable<Artwork[]> {
    return this.artworksSubject.asObservable();
  }

  /** All artists on the platform. */
  getArtists(): Observable<Artist[]> {
    return this.artistsSubject.asObservable();
  }

  /** The artworks shown in the "Featured" section of the home page. */
  getFeaturedArtworks(limit: number = 4): Artwork[] {
    return ARTWORKS.filter((artwork) => artwork.featured).slice(0, limit);
  }

  /** Find one artwork by its id, or undefined when it does not exist. */
  getArtworkById(id: number): Artwork | undefined {
    return ARTWORKS.find((artwork) => artwork.id === id);
  }

  /** Find one artist by id, or undefined when it does not exist. */
  getArtistById(id: number): Artist | undefined {
    return ARTISTS.find((artist) => artist.id === id);
  }

  /** Everything drawn by one artist, used on the artist cards and detail pages. */
  getArtworksByArtist(artistId: number): Artwork[] {
    return ARTWORKS.filter((artwork) => artwork.artistId === artistId);
  }

  /**
   * The highest price in the catalogue, so the price slider always covers
   * the full range no matter how the mock data changes.
   */
  getMaxPrice(): number {
    return Math.max(...ARTWORKS.map((artwork) => artwork.price));
  }
}
