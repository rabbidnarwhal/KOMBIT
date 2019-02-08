import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Category } from '../models/category';

@Injectable()
export class DataCategoryServiceProvider {
  constructor(private api: ApiServiceProvider) {}

  getListCategory(): Promise<Array<Category>> {
    return new Promise((resolve, reject) => {
      this.api.get('/category').subscribe((sub) => resolve(sub), (error) => reject(error));
    });
  }
}
