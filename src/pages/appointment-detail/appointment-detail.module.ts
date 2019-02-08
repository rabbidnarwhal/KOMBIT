import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentDetailPage } from './appointment-detail';
import { AppointmentServiceProvider } from '../../providers/appointment-service';

@NgModule({
  declarations: [ AppointmentDetailPage ],
  imports: [ IonicPageModule.forChild(AppointmentDetailPage) ],
  providers: [ AppointmentServiceProvider ]
})
export class AppointmentDetailPageModule {}
