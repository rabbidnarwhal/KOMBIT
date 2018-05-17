import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the PostNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'newPost'
})
@Component({
  selector: 'page-post-new',
  templateUrl: 'post-new.html'
})
export class PostNewPage {
  public image: any;
  public video: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private sanitization: DomSanitizer,
    private transfer: FileTransfer
  ) {}

  publishClick() {
    alert('Publish');
    this.navCtrl.pop();
  }

  getPicture() {
    this.loadMediaFile(this.camera.MediaType.PICTURE);
  }

  getVideo() {
    this.loadMediaFile(this.camera.MediaType.VIDEO);
  }

  private loadMediaFile(type) {
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        alert('Not Supported on browser');
      } else {
        const options: CameraOptions = {
          quality: 80,
          mediaType: type,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum: false,
          correctOrientation: true,
          targetHeight: 500,
          targetWidth: 500
        };
        this.camera
          .getPicture(options)
          .then(imagePath => {
            if (type === this.camera.MediaType.PICTURE) {
              this.image = this.sanitization.bypassSecurityTrustStyle('url(' + imagePath + ')');
            } else {
              this.video = imagePath;
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }
}
