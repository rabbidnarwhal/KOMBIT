import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostNewPage } from './post-new';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

@NgModule({
  declarations: [PostNewPage],
  imports: [IonicPageModule.forChild(PostNewPage)],
  providers: [Camera, File, FilePath, FileTransfer, DataProductServiceProvider]
})
export class PostNewPageModule {}
