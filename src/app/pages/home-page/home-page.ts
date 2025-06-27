import { Component, ViewChild } from '@angular/core';
import { RecipeForm } from '../recipe-form/recipe-form';
import { RecipeList } from '../recipe-list/recipe-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RecipeForm, RecipeList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  @ViewChild(RecipeList) recipeList!: RecipeList;

  onRecipeSaved() {
    this.recipeList.loadRecipes(); // refresh list after save
  }
}
