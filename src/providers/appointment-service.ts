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
    return this.api.get('/appointment/user/' + userId, { headers: header }).toPromise();
  }

  getAppointmentDetail(id): Promise<AppointmentDetailResponse> {
    return this.api.get('/appointment/' + id).toPromise();
  }

  createAppointment(data): Promise<any> {
    const userId = this.auth.getPrincipal().id;
    data.MakerId = userId;
    return this.api.post('/appointment/', data).toPromise();
  }

  updateStatusAppointment(id, data): Promise<any> {
    return this.api.post('/appointment/' + id, data).toPromise();
  }
}
