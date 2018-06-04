import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyPage } from './company';
import { DataCompanyServiceProvider } from '../../providers/dataCompany-service';

@NgModule({
  declarations: [CompanyPage],
  providers: [DataCompanyServiceProvider],
  imports: [IonicPageModule.forChild(CompanyPage)]
})
export class CompanyPageModule {}
