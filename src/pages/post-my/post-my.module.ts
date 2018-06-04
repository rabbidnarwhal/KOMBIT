import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostMyPage } from './post-my';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

@NgModule({
  declarations: [PostMyPage],
  imports: [IonicPageModule.forChild(PostMyPage)],
  providers: [DataProductServiceProvider]
})
export class PostMyPageModule {}
