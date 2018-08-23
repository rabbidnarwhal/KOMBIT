import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Province } from '../models/province';
import { City } from '../models/city';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvinceServiceProvider {
  private listCity: Array<City> = [];
  private listProvince: Array<Province> = [];

  constructor(private api: ApiServiceProvider) {}

  getListProvince(): Promise<Array<Province>> {
    return new Promise((resolve, reject) => {
      this.api.get('/provinsi').subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  getListCityByProvince(id): Promise<Array<City>> {
    return new Promise((resolve, reject) => {
      this.api.get('/kabkota/provinsi/' + id).subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  getListCity(): Promise<Array<City>> {
    return new Promise((resolve, reject) => {
      this.api.get('/kabkota').subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  getCity(): Promise<City[]> {
    return new Promise(resolve => {
      if (this.listCity.length){
        resolve(this.listCity);
      } else {
        this.getListCity().then(res => {
          this.listCity = res;
          resolve(res);
        }).catch (err => {
          resolve([]);
        })
      }
    })
  }

  getProvince():Promise<Province[]> {
    return new Promise(resolve => {
      if (this.listProvince.length){
        resolve(this.listProvince);
      } else {
        this.getListProvince().then(res => {
          this.listProvince = res;
          resolve(res);
        }).catch (err => {
          resolve([]);
        })
      }
    })
  }

  setCity(city) {
    this.listCity = city;
  }

  setProvince(province) {
    this.listProvince = province;
  }
}
