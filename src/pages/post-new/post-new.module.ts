import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostNewPage } from './post-new';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { QuillModule } from 'ngx-quill';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { Contacts } from '@ionic-native/contacts';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ PostNewPage ],
  imports: [ IonicPageModule.forChild(PostNewPage), QuillModule, FooterMenuModule ],
  providers: [ Camera, File, FilePath, FileTransfer, DataProductServiceProvider, IOSFilePicker, FileChooser, Contacts ]
})
export class PostNewPageModule {}
