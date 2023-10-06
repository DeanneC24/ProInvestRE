export interface OutcodeSearchResult {
    avg_yield: number;
    avg_rent: number;
    growth_1y: number;
    outcode: string;
    growth_3y: number;
    sales_per_month: number;
    avg_price: number;
    growth_5y: number;
    region: string;
    avg_price_psf: number;
}

export type RegionOption =
  | 'north_east'
  | 'north_west'
  | 'east_midlands'
  | 'west_midlands'
  | 'east_of_england'
  | 'greater_london'
  | 'south_east'
  | 'south_west'
  | 'wales'
  | 'scotland'
  | 'northern_ireland';
