import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchableSelectPage } from './searchable-select';

@NgModule({
  declarations: [
    SearchableSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchableSelectPage),
  ],
})
export class SearchableSelectPageModule {}
