export interface RecommendFilters {
  isVeg?: boolean;
  cuisine?: string;
}

export interface RecommendPick {
  menuItemId: string;
  name: string;
  reason: string;
}
