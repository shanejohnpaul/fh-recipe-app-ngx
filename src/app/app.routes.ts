import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full',
  },
  {
    path: 'recipes',
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'recipes/new',
    loadComponent: () =>
      import('./pages/recipe-form/recipe-form').then((m) => m.RecipeForm),
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
  },
];
