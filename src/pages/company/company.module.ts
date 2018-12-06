import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyPage } from './company';
import { DataCompanyServiceProvider } from '../../providers/dataCompany-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ CompanyPage ],
  providers: [ DataCompanyServiceProvider ],
  imports: [ IonicPageModule.forChild(CompanyPage), FooterMenuModule ]
})
export class CompanyPageModule {}
