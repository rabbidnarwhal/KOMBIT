import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { AppointmentResponse } from '../../models/appointment';
import { AppointmentServiceProvider } from '../../providers/appointment-service';

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html'
})
export class AppointmentPage {
  isSearching: boolean;
  listAppointment: Array<AppointmentResponse> = new Array<AppointmentResponse>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appointmentService: AppointmentServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.listAppointment = [];
  }

  ionViewDidLoad() {
    this.loadAppointment();
  }

  private loadAppointment() {
    this.isSearching = true;
    this.appointmentService
      .getAppointments()
      .then((res: Array<AppointmentResponse>) => {
        this.listAppointment = res.map((item: AppointmentResponse) => {
          const obj = item;
          const time = new Date(item.date);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.date = time.toLocaleString();
          return obj;
        });
        this.isSearching = false;
      })
      .catch((err) => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  openDetail(item: AppointmentResponse) {
    this.navCtrl.push('AppointmentDetailPage', { appointmentId: item.id, userName: item.userName });
  }
}
