import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalMarketingKitPage } from './modal-marketing-kit';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [ ModalMarketingKitPage ],
  imports: [ IonicPageModule.forChild(ModalMarketingKitPage) ],
  providers: [ File, FilePath, IOSFilePicker, FileChooser ]
})
export class ModalMarketingKitPageModule {}
