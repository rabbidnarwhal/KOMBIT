import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage)],
  providers:[DataProductServiceProvider],
})
export class HomePageModule {}
