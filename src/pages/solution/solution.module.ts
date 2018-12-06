import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolutionPage } from './solution';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ SolutionPage ],
  imports: [ IonicPageModule.forChild(SolutionPage), FooterMenuModule ],
  providers: [ DataCategoryServiceProvider ]
})
export class SolutionPageModule {}
