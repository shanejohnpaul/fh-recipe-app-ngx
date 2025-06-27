import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { NutritionData, Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(RecipeService);

  recipe?: Recipe;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById(+id).subscribe((recipe) => {
        this.recipe = recipe;
      });
    }
  }

  isNutritionData(
    nutrition: NutritionData | string | undefined
  ): nutrition is NutritionData {
    return typeof nutrition === 'object' && nutrition !== null;
  }
}
