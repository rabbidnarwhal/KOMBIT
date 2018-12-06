import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ ProfilePage ],
  imports: [ IonicPageModule.forChild(ProfilePage), FooterMenuModule ],
  providers: [ Camera, File, FilePath, FileTransfer ]
})
export class ProfilePageModule {}
