import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RecipeService } from '../../services/recipe.service';
import { Recipe, Ingredient, Step } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  @Output() recipeSaved = new EventEmitter<void>();

  recipeForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    ingredients: this.fb.array([]),
    steps: this.fb.array([]),
  });

  recipeId?: string;
  loading = false;

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.recipeId) {
      this.loading = true;
      this.recipeService.getById(+this.recipeId).subscribe((recipe) => {
        this.loading = false;
        this.recipeForm.patchValue({ title: recipe.title });
        recipe.ingredients?.forEach((i) => this.addIngredient(i));
        recipe.steps?.forEach((s) => this.addStep(s));
      });
    } else {
      const saved = localStorage.getItem('recipeFormDraft');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.recipeForm.patchValue({ title: parsed.title || '' });

        parsed.ingredients?.forEach((i: Ingredient) => this.addIngredient(i));
        parsed.steps?.forEach((s: Step) => this.addStep(s));
      } else {
        this.addIngredient();
        this.addStep();
      }

      // Watch and save changes to localStorage
      this.recipeForm.valueChanges.subscribe((value) => {
        localStorage.setItem('recipeFormDraft', JSON.stringify(value));
      });
    }
  }

  // Accessors
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  // Ingredient Handlers
  addIngredient(ingredient?: Ingredient) {
    this.ingredients.push(
      this.fb.group({
        name: [ingredient?.name || '', Validators.required],
        nutrition: [ingredient?.nutrition || null],
      })
    );
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Step Handlers
  addStep(step?: Step) {
    this.steps.push(
      this.fb.group({
        description: [step?.description || '', Validators.required],
      })
    );
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  //  Submit
  onSubmit() {
    if (this.recipeForm.invalid) return;

    const raw = this.recipeForm.value;
    const payload: Recipe = {
      title: raw.title,
      ingredients: raw.ingredients?.map((i: Ingredient) => ({ name: i.name })),
      steps: raw.steps?.map((s: Step, i: number) => ({
        description: s.description,
        order: i + 1,
      })),
    };

    const request = this.recipeId
      ? this.recipeService.update(+this.recipeId, payload)
      : this.recipeService.create(payload);

    request.subscribe(() => {
      if (!this.recipeId) {
        // Clear form and localStorage
        this.recipeForm.reset();
        this.ingredients.clear();
        this.steps.clear();

        // Add one blank input to each array (for fresh entry)
        this.addIngredient();
        this.addStep();

        localStorage.removeItem('recipeFormDraft');
        this.recipeSaved.emit(); // notify list
      }

      if (this.recipeId) {
        this.router.navigate(['/recipes']);
      }
    });
  }
}
