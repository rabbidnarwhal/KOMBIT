import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { UtilityServiceProvider } from './utility-service';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataCategoryServiceProvider {
  private category: any;

  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider) {}

  getListCategory() {
    return new Promise((resolve, reject) => {
      this.api.get('/category').subscribe(
        sub => {
          this.setCategory(sub);
          resolve();
        },
        error => reject(error)
      );
    });
  }

  setCategory(data) {
    if (data) this.category = data;
  }

  getCategory() {
    return this.category;
  }
}
