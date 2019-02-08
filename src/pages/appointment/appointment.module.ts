import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentPage } from './appointment';
import { AppointmentServiceProvider } from '../../providers/appointment-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ AppointmentPage ],
  imports: [ IonicPageModule.forChild(AppointmentPage), FooterMenuModule ],
  providers: [ AppointmentServiceProvider ]
})
export class AppointmentPageModule {}
