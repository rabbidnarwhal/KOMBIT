import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Company } from '../models/company';

@Injectable()
export class DataCompanyServiceProvider {
  constructor(private api: ApiServiceProvider) {}

  getListCompany(): Promise<Array<Company>> {
    return new Promise((resolve, reject) => {
      this.api.get('/company').subscribe((sub) => resolve(sub), (error) => reject(error));
    });
  }

  getDetailCompany(id) {
    return new Promise((resolve, reject) => {
      this.api.get('/company' + id).subscribe((sub) => resolve(sub), (error) => reject(error));
    });
  }
}
