import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { UtilityServiceProvider } from './utility-service';
import { Company } from '../models/company';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataCompanyServiceProvider {
  private company: Array<Company>;

  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider) {}

  getListCompany() {
    return new Promise((resolve, reject) => {
      this.api.get('/company').subscribe(
        sub => {
          this.setCompany(sub);
          resolve();
        },
        error => reject(error)
      );
    });
  }

  getDetailCompany(id) {
    return new Promise((resolve, reject) => {
      this.api.get('/company' + id).subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  setCompany(data) {
    if (data) this.company = data;
  }

  getCompany() {
    return this.company;
  }
}
