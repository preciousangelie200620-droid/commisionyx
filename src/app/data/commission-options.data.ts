import { CommissionOption } from '../models/commission.model';

/** The four main categories shown on the home page and used for filtering. */
export const CATEGORIES: string[] = ['Portraits', 'Anime', 'Illustrations', 'Fan Art'];

/** Every art style available in the catalogue, used for the style filter. */
export const ART_STYLES: string[] = ['Digital Painting', 'Oil Painting', 'Anime / Cel-shaded', 'Concept Art'];

/** Art types a client can request, with the base price of each. */
export const COMMISSION_ART_TYPES: CommissionOption[] = [
  { id: 'portrait', label: 'Portrait', price: 120, description: 'Head and shoulders, one character.' },
  { id: 'halfbody', label: 'Half Body', price: 180, description: 'Waist up, more room for costume detail.' },
  { id: 'fullbody', label: 'Full Body', price: 260, description: 'Complete figure with pose and prop.' },
  { id: 'illustration', label: 'Full Illustration', price: 380, description: 'Scene artwork with a full background.' }
];

/** Rendering styles, expressed as a multiplier applied to the base price. */
export const COMMISSION_STYLES: CommissionOption[] = [
  { id: 'sketch', label: 'Pencil Sketch', price: 0.6, description: 'Rough graphite lines, no colour.' },
  { id: 'lined', label: 'Lined + Flat Colour', price: 0.85, description: 'Clean line art with flat colour blocks.' },
  { id: 'cel', label: 'Cel Shaded', price: 1.0, description: 'Anime style with crisp shadow shapes.' },
  { id: 'painterly', label: 'Painterly Rendering', price: 1.4, description: 'Soft blended brushwork, high detail.' },
  { id: 'oil', label: 'Oil Painting Style', price: 1.75, description: 'Classical chiaroscuro in oils.' }
];

/** Background choices, as a flat fee added to the estimate. */
export const COMMISSION_BACKGROUNDS: CommissionOption[] = [
  { id: 'none', label: 'No Background', price: 0, description: 'Transparent or flat colour.' },
  { id: 'simple', label: 'Simple Pattern', price: 20, description: 'Gradient, texture or repeating motif.' },
  { id: 'detailed', label: 'Detailed Scene', price: 70, description: 'Painted environment behind the subject.' },
  { id: 'epic', label: 'Epic Scenery', price: 140, description: 'Full storytelling location, cinematic.' }
];

/** Usage rights. Commercial work costs more than a personal commission. */
export const COMMISSION_USAGE: CommissionOption[] = [
  { id: 'personal', label: 'Personal Use', price: 0, description: 'Profile pictures, printing, personal projects.' },
  { id: 'commercial', label: 'Commercial Use', price: 150, description: 'Games, books, merchandise or paid promotion.' }
];

/** Deadline options, as a multiplier added on top of the whole estimate. */
export const COMMISSION_DEADLINES: CommissionOption[] = [
  { id: 'flexible', label: 'Flexible (no rush)', price: 0, description: 'Whenever the artist gets to it.' },
  { id: 'standard', label: 'Standard (4 to 6 weeks)', price: 0.05, description: 'The usual queue position.' },
  { id: 'soon', label: 'Priority (2 to 3 weeks)', price: 0.2, description: 'Moves ahead of the standard queue.' },
  { id: 'rush', label: 'Rush (7 days)', price: 0.45, description: 'Artist clears their schedule for you.' }
];

/** How much each extra character beyond the first costs. */
export const EXTRA_CHARACTER_FEE = 60;

/** Platform service fee kept by CommisioNyx, as a decimal. */
export const SERVICE_FEE_RATE = 0.05;

/** Sales tax applied at checkout, as a decimal. */
export const TAX_RATE = 0.08;
