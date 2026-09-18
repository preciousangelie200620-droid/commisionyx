import { Injectable } from '@angular/core';
import { PriceBreakdown } from '../models/commission.model';
import {
  COMMISSION_ART_TYPES,
  COMMISSION_BACKGROUNDS,
  COMMISSION_DEADLINES,
  COMMISSION_STYLES,
  COMMISSION_USAGE,
  EXTRA_CHARACTER_FEE
} from '../data/commission-options.data';
import { ARTISTS } from '../data/artists.data';

/**
 * Works out what a commission will cost.
 *
 * The estimate is recalculated by the Commissions page every time the user
 * changes a field, which is what makes the price update live.
 */
@Injectable({ providedIn: 'root' })
export class CommissionService {
  /**
   * Build a full price breakdown from the user's choices.
   *
   * Formula:
   *   base x style multiplier    -> art type and rendering style
   *   + extra characters         -> every character after the first
   *   + background fee           -> flat fee
   *   x artist rate multiplier   -> more experienced artists cost more
   *   + commercial licence       -> flat fee
   *   + rush fee                 -> percentage of everything above
   */
  calculatePrice(
    artTypeId: string,
    styleId: string,
    characterCount: number,
    backgroundId: string,
    usageId: string,
    deadlineId: string,
    artistId: number
  ): PriceBreakdown {
    const base = this.findPrice(COMMISSION_ART_TYPES, artTypeId, 120);
    const styleMultiplier = this.findPrice(COMMISSION_STYLES, styleId, 1);
    const backgroundFee = this.findPrice(COMMISSION_BACKGROUNDS, backgroundId, 0);
    const commercialFee = this.findPrice(COMMISSION_USAGE, usageId, 0);
    const rushMultiplier = this.findPrice(COMMISSION_DEADLINES, deadlineId, 0);
    const rushLabel = this.findLabel(COMMISSION_DEADLINES, deadlineId, 'Flexible (no rush)');

    const artist = ARTISTS.find((entry) => entry.id === Number(artistId));
    const artistMultiplier = artist ? artist.rateMultiplier : 1;

    // Style adjusts the base price - shown separately so the user sees why.
    const styledBase = base * styleMultiplier;
    const styleAdjustment = styledBase - base;

    // The first character is included; each extra one is a flat fee.
    const safeCharacterCount = Math.max(1, Math.min(6, Number(characterCount) || 1));
    const characterFee = (safeCharacterCount - 1) * EXTRA_CHARACTER_FEE;

    // Artist reputation is applied to the artwork itself, not to add-ons.
    const artistBase = base + styleAdjustment + characterFee + backgroundFee;
    const artistAdjustment = artistBase * (artistMultiplier - 1);

    const beforeRush = artistBase + artistAdjustment + commercialFee;
    const rushFee = beforeRush * rushMultiplier;

    return {
      base: this.round(base),
      styleAdjustment: this.round(styleAdjustment),
      characterFee: this.round(characterFee),
      backgroundFee: this.round(backgroundFee),
      artistAdjustment: this.round(artistAdjustment),
      commercialFee: this.round(commercialFee),
      rushFee: this.round(rushFee),
      total: this.round(beforeRush + rushFee),
      rushLabel
    };
  }

  /** Look up the price of an option by id, with a fallback for safety. */
  private findPrice(
    options: { id: string; price: number }[],
    id: string,
    fallback: number
  ): number {
    const found = options.find((option) => option.id === id);
    return found ? found.price : fallback;
  }

  /** Look up the readable label of an option by id. */
  private findLabel(
    options: { id: string; label: string }[],
    id: string,
    fallback: string
  ): string {
    const found = options.find((option) => option.id === id);
    return found ? found.label : fallback;
  }

  /** Round to two decimals so the estimate never shows floating point noise. */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
