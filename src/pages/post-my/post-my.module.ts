import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostMyPage } from './post-my';

@NgModule({
  declarations: [
    PostMyPage,
  ],
  imports: [
    IonicPageModule.forChild(PostMyPage),
  ],
})
export class PostMyPageModule {}
