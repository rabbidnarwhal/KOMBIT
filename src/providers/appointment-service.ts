import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { AppointmentResponse, AppointmentDetailResponse } from '../models/appointment';
import { AuthServiceProvider } from './auth-service';

@Injectable()
export class AppointmentServiceProvider {
  constructor(private api: ApiServiceProvider, private auth: AuthServiceProvider) {}

  getAppointments(): Promise<Array<AppointmentResponse>> {
    const userId = this.auth.getPrincipal().id;
    const header = { 'Cache-Control': 'no-cache' };
    return new Promise((resolve, reject) => {
      this.api
        .get('/appointment/user/' + userId, { headers: header })
        .subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  getAppointmentDetail(id): Promise<AppointmentDetailResponse> {
    return new Promise((resolve, reject) => {
      this.api.get('/appointment/' + id).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  createAppointment(data): Promise<any> {
    const userId = this.auth.getPrincipal().id;
    data.MakerId = userId;
    return new Promise((resolve, reject) => {
      this.api.post('/appointment/', data).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  updateStatusAppointment(id, data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.post('/appointment/' + id, data).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }
}
