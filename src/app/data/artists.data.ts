import { Artist } from '../models/artist.model';

/**
 * Sample artists for the CommisioNyx marketplace.
 * In a real app this data would come from an HTTP API.
 */
export const ARTISTS: Artist[] = [
  {
    id: 1,
    name: 'Seraphine Vale',
    avatar: 'assets/img/artists/artist_01.png',
    bio: 'Dark fantasy portraitist working in oils and digital paint. I specialise in noble houses, vampires and doomed royalty.',
    specialties: ['Portraits', 'Fantasy', 'Gothic'],
    completedCommissions: 248,
    rating: 4.9,
    reviews: 312,
    startingPrice: 120,
    location: 'Prague, Czechia',
    joinedYear: 2019,
    responseTime: 'Under 12 hours',
    rateMultiplier: 1.35
  },
  {
    id: 2,
    name: 'Corvin Ashgrave',
    avatar: 'assets/img/artists/artist_02.png',
    bio: 'Concept artist for horror and dark fantasy games. I build worlds that feel ancient, ruined and quietly threatening.',
    specialties: ['Concept Art', 'Environments', 'Gothic'],
    completedCommissions: 176,
    rating: 4.8,
    reviews: 204,
    startingPrice: 150,
    location: 'Edinburgh, Scotland',
    joinedYear: 2018,
    responseTime: 'Under 24 hours',
    rateMultiplier: 1.45
  },
  {
    id: 3,
    name: 'Mira Kurogane',
    avatar: 'assets/img/artists/artist_03.png',
    bio: 'Anime and manga illustrator with a taste for the gothic. Dynamic poses, crimson moons and sharp line art.',
    specialties: ['Anime', 'Character Design', 'Fan Art'],
    completedCommissions: 431,
    rating: 5.0,
    reviews: 528,
    startingPrice: 90,
    location: 'Osaka, Japan',
    joinedYear: 2020,
    responseTime: 'Under 6 hours',
    rateMultiplier: 1.2
  },
  {
    id: 4,
    name: 'Rowan Nightshade',
    avatar: 'assets/img/artists/artist_04.png',
    bio: 'Character designer working across cosmic horror and elegant gothic fashion. Comfortable with unusual briefs.',
    specialties: ['Character Design', 'Illustrations', 'Cosmic Horror'],
    completedCommissions: 193,
    rating: 4.7,
    reviews: 167,
    startingPrice: 110,
    location: 'Portland, USA',
    joinedYear: 2021,
    responseTime: 'Under 18 hours',
    rateMultiplier: 1.25
  },
  {
    id: 5,
    name: 'Elias Drakemoor',
    avatar: 'assets/img/artists/artist_05.png',
    bio: 'Classically trained oil painter. Rich chiaroscuro, ornate armour and dramatic single-source lighting.',
    specialties: ['Portraits', 'Illustrations', 'Fantasy'],
    completedCommissions: 142,
    rating: 4.9,
    reviews: 188,
    startingPrice: 180,
    location: 'Vienna, Austria',
    joinedYear: 2017,
    responseTime: 'Under 36 hours',
    rateMultiplier: 1.55
  },
  {
    id: 6,
    name: 'Lilith Marrow',
    avatar: 'assets/img/artists/artist_06.png',
    bio: 'Horror illustrator and creature designer. I love monsters, blood moons and things that should not be seen.',
    specialties: ['Fan Art', 'Horror', 'Creature Design'],
    completedCommissions: 287,
    rating: 4.8,
    reviews: 341,
    startingPrice: 100,
    location: 'New Orleans, USA',
    joinedYear: 2019,
    responseTime: 'Under 10 hours',
    rateMultiplier: 1.3
  }
];
