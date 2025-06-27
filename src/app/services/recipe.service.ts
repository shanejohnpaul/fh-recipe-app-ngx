import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'http://recipe-app-backend.test/api/recipes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  create(recipe: Recipe): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, recipe);
  }

  update(id: number, recipe: Recipe): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${this.apiUrl}/${id}`, recipe);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
