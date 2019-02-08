import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { MakeAppointmentComponent } from './make-appointment';
import { DatePicker } from '@ionic-native/date-picker';
import { AppointmentServiceProvider } from '../../providers/appointment-service';

@NgModule({
  declarations: [ MakeAppointmentComponent ],
  imports: [ IonicModule ],
  exports: [ MakeAppointmentComponent ],
  providers: [ DatePicker, AppointmentServiceProvider ]
})
export class MakeAppointmentModule {}
