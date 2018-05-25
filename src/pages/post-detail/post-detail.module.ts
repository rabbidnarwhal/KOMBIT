import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostDetailPage } from './post-detail';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

@NgModule({
  declarations: [PostDetailPage],
  imports: [IonicPageModule.forChild(PostDetailPage)],
  providers: [DataProductServiceProvider]
})
export class PostDetailPageModule {}
