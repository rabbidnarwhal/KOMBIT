import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostDetailPage } from './post-detail';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { ComponentsModule } from '../../components/components.module';
import { File } from '@ionic-native/file';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [ PostDetailPage ],
  imports: [ IonicPageModule.forChild(PostDetailPage), ComponentsModule ],
  providers: [ DataProductServiceProvider, File, CallNumber ]
})
export class PostDetailPageModule {}
