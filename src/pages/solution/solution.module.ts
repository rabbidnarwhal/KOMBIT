import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolutionPage } from './solution';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';

@NgModule({
  declarations: [SolutionPage],
  imports: [IonicPageModule.forChild(SolutionPage)],
  providers: [DataCategoryServiceProvider]
})
export class SolutionPageModule {}
