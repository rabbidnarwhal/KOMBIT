import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { UtilityServiceProvider } from './utility-service';
import { Category } from '../models/category';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataCategoryServiceProvider {
  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider) {}

  getListCategory(): Promise<Array<Category>> {
    return new Promise((resolve, reject) => {
      this.api.get('/category').subscribe(sub => resolve(sub), error => reject(error));
    });
  }
}
