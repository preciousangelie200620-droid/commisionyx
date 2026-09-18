import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist.model';
import { ArtworkService } from '../../services/artwork.service';

/**
 * The Artists page.
 *
 * Shows one card per artist with their portfolio size, rating and specialties,
 * and lets the visitor sort the list.
 */
@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent implements OnInit {
  /** The full list of artists. */
  allArtists: Artist[] = [];

  /** The list after sorting - what the page renders. */
  visibleArtists: Artist[] = [];

  /** The chosen sort order. */
  sortBy = 'rating';

  /** Specialties collected from the artists, for the filter row. */
  specialties: string[] = [];

  /** The specialty currently being filtered on ('' means all). */
  selectedSpecialty = '';

  /** Sort orders offered on the page. */
  readonly sortOptions = [
    { value: 'rating', label: 'Highest rated' },
    { value: 'commissions', label: 'Most commissions completed' },
    { value: 'price', label: 'Lowest starting price' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  constructor(private artworkService: ArtworkService) {}

  /** Load the artists and collect every specialty they list. */
  ngOnInit(): void {
    this.artworkService.getArtists().subscribe((artists) => {
      this.allArtists = artists;

      // Flatten the specialties and keep only unique values.
      this.specialties = Array.from(
        new Set(artists.reduce((all: string[], artist) => all.concat(artist.specialties), []))
      ).sort();

      this.applySorting();
    });
  }

  /** Filter by specialty and apply the chosen sort order. */
  applySorting(): void {
    let results = [...this.allArtists];

    if (this.selectedSpecialty) {
      results = results.filter((artist) =>
        artist.specialties.includes(this.selectedSpecialty)
      );
    }

    switch (this.sortBy) {
      case 'commissions':
        results.sort((a, b) => b.completedCommissions - a.completedCommissions);
        break;
      case 'price':
        results.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => b.rating - a.rating);
    }

    this.visibleArtists = results;
  }

  /** Switch the specialty filter from a chip. */
  selectSpecialty(specialty: string): void {
    // Clicking the active chip clears the filter.
    this.selectedSpecialty = this.selectedSpecialty === specialty ? '' : specialty;
    this.applySorting();
  }
}
