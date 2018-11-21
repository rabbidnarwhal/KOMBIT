import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppointmentServiceProvider } from '../../providers/appointment-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { AppointmentDetailResponse, AppointmentStatusRequest } from '../../models/appointment';
import { Config } from '../../config/config';
import { AuthServiceProvider } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-appointment-detail',
  templateUrl: 'appointment-detail.html'
})
export class AppointmentDetailPage {
  data: AppointmentDetailResponse;
  mapLocation: string = '';
  isCustomer = true;
  isRejected = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appointmentService: AppointmentServiceProvider,
    private utility: UtilityServiceProvider,
    private alertCtrl: AlertController,
    private auth: AuthServiceProvider
  ) {
    this.data = new AppointmentDetailResponse();
  }

  ionViewDidLoad() {
    this.loadAppointmentDetail();
  }

  loadAppointmentDetail() {
    this.appointmentService
      .getAppointmentDetail(this.navParams.data.appointmentId)
      .then((res) => {
        this.data = res;
        const time = new Date(res.date);
        time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
        this.data.date = time.toLocaleString();
        this.data.userName = this.navParams.data.userName;
        this.isCustomer = this.auth.getPrincipal().role === 'Customer' ? true : false;
        this.isRejected = this.data.status === 'REJECT' ? true : false;
        this.createMap();
        console.log(this.isCustomer);
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
  }

  answerAppointment(answer) {
    if (answer === 'APPROVE') {
      this.updateStatus(answer);
    } else if (answer === 'REJECT') {
      const prompt = this.alertCtrl.create({
        title: 'Reject Appointment',
        message: 'Enter a reason for this reject.',
        inputs: [
          {
            name: 'rejectMessage',
            placeholder: 'Message'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: (data) => {
              console.log('Cancel clicked', data);
            }
          },
          {
            text: 'Ok',
            handler: (data) => {
              console.log('Saved clicked', data);
              if (!data.rejectMessage) {
                this.utility.showToast('Message is required!');
                return false;
              }
              this.updateStatus(answer, data.rejectMessage);
              return true;
            }
          }
        ]
      });
      prompt.present();
    }
  }

  updateStatus(answer, message = '') {
    const request: AppointmentStatusRequest = {
      RejectMessage: message,
      Status: answer
    };
    this.appointmentService
      .updateStatusAppointment(this.navParams.data.appointmentId, request)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((err) => this.utility.showToast(err));
  }

  createMap() {
    const position = this.data.locationCoords ? this.data.locationCoords.split(',') : [];
    if (position.length)
      this.mapLocation =
        'https://maps.googleapis.com/maps/api/staticmap?center=' +
        position[0].trim() +
        ',' +
        position[1].trim() +
        '&markers=color:orange%7Clabel:C%7C' +
        position[0].trim() +
        ',' +
        position[1].trim() +
        '&zoom=16&size=400x200&key=' +
        Config.GOOGLE_MAP_API_KEY;
  }

  openMap() {
    location.href =
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' +
      this.data.locationCoords.replace(' ', '');

    // use below code if not going to open map to external app/browser
    // this.navCtrl.push('map-popover', { coordinate: this.data.contact.addressKoordinat });
  }

  rescheduleAppointment() {
    alert('under developing');
  }
}
