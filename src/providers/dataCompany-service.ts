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
  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider) {}

  getListCompany(): Promise<Array<Company>> {
    return new Promise((resolve, reject) => {
      this.api.get('/company').subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  getDetailCompany(id) {
    return new Promise((resolve, reject) => {
      this.api.get('/company' + id).subscribe(sub => resolve(sub), error => reject(error));
    });
  }
}
