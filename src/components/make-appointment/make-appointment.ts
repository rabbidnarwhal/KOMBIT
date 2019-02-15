import { Component, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppointmentRequest } from '../../models/appointment';
import { NavController, NavParams, Events } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { AppointmentServiceProvider } from '../../providers/appointment-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { ProductDetail } from '../../models/products';
import { AuthServiceProvider } from '../../providers/auth-service';

@Component({
  selector: 'make-appointment',
  templateUrl: 'make-appointment.html'
})
export class MakeAppointmentComponent {
  text: string;
  @Input() data: ProductDetail;

  @Output() closePage = new EventEmitter();
  @ViewChild('form') form: NgForm;

  dateDisplay: string;
  appointment: AppointmentRequest;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    private appointmentService: AppointmentServiceProvider,
    private events: Events,
    private utility: UtilityServiceProvider,
    private element: ElementRef,
    private auth: AuthServiceProvider
  ) {
    this.appointment = new AppointmentRequest();
  }

  selectLocation() {
    // this.navCtrl.push('map-location', { type: 'choose', coordinate: this.data.addressKoordinat });
    this.navCtrl.push('map-popover', {
      type: 'choose',
      coordinate: this.appointment.LocationCoords || null
    });

    this.events.subscribe('location-appointment', (res) => {
      this.appointment.LocationCoords = res.coordinate;
      this.appointment.LocationName = res.address;
      this.events.unsubscribe('location-appointment');
    });
  }

  selectDate() {
    this.datePicker
      .show({
        date: new Date(),
        mode: 'datetime',
        minDate: new Date()
      })
      .then(
        (data) => {
          this.appointment.Date = data.toUTCString();
          this.dateDisplay = data.toLocaleDateString() + ', ' + data.toLocaleTimeString();
        },
        (err) => {}
      );
  }

  adjustTextareaHeight() {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.height = '16px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  createAppointment() {
    this.appointment.MakerId = this.auth.getPrincipal().id;
    this.appointment.RecepientId = this.data.poster.id;
    this.appointment.ProductId = this.data.id;
    this.appointmentService
      .createAppointment(this.appointment)
      .then(() => {
        this.utility.showToast('success');
        this.closePage.emit();
      })
      .catch((err) => this.utility.showToast(err));
  }
}
