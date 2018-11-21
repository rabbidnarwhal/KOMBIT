import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentPage } from './appointment';
import { AppointmentServiceProvider } from '../../providers/appointment-service';

@NgModule({
  declarations: [ AppointmentPage ],
  imports: [ IonicPageModule.forChild(AppointmentPage) ],
  providers: [ AppointmentServiceProvider ]
})
export class AppointmentPageModule {}
