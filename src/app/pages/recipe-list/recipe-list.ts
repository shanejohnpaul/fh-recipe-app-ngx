import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList implements OnInit {
  private api = inject(RecipeService);
  recipes: Recipe[] = [];

  loadRecipes(): void {
    this.api.getAll().subscribe((data) => {
      this.recipes = data;
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  deleteRecipe(id: string) {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.api.delete(+id).subscribe(() => {
        this.recipes = this.recipes.filter((r) => r.id !== id);
      });
    }
  }
}
