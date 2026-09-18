/**
 * A selectable option inside the commission request form (art type, style, background...).
 * `price` is either a flat fee or a multiplier, depending on the field it belongs to.
 */
export interface CommissionOption {
  id: string;
  label: string;
  price: number;
  description: string;
}

/**
 * The full commission request, exactly as the user filled it in.
 */
export interface CommissionRequest {
  artType: string;
  artistId: number;
  characterCount: number;
  style: string;
  background: string;
  usage: string;
  deadline: string;
  instructions: string;
  referenceName: string;
  estimatedPrice: number;
}

/**
 * The live price breakdown shown next to the commission form.
 * Each line helps the user understand how the estimate was calculated.
 */
export interface PriceBreakdown {
  base: number;
  styleAdjustment: number;
  characterFee: number;
  backgroundFee: number;
  artistAdjustment: number;
  commercialFee: number;
  rushFee: number;
  total: number;
  rushLabel: string;
}
