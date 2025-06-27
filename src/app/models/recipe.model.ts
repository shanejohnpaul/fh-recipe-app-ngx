export interface NutritionData {
  carbs: number;
  fat: number;
  protein: number;
}

export interface Ingredient {
  name: string;
  nutrition?: NutritionData | string; // Can be a string if not found
}

export interface Step {
  description: string;
}

export interface Recipe {
  id?: string;
  title: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  createdAt?: Date;
}
