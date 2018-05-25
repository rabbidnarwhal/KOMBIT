import { ApiServiceProvider } from '../../providers/api-service';
import { AuthServiceProvider } from '../../providers/auth-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Category } from '../../models/category';
import { NewProduct } from '../../models/products';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormValidatorProvider } from '../../providers/form-validator';
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
  @ViewChild('videoShow') video: ElementRef;
  private imagePath: string;
  private videoPath: string;
  public imagePathSecure: any;
  public videoPathPublic: any;
  public listCategory: Array<Category>;
  public data: NewProduct;
  @ViewChild('form') form: NgForm;
  constructor(
    private navCtrl: NavController,
    private api: ApiServiceProvider,
    private camera: Camera,
    private sanitization: DomSanitizer,
    private transfer: FileTransfer,
    private utility: UtilityServiceProvider,
    private file: File,
    private auth: AuthServiceProvider,
    private formValidator: FormValidatorProvider
  ) {
    this.listCategory = new Array<Category>();
    this.data = new NewProduct(this.auth.getPrincipal());
  }

  ionViewDidLoad() {
    this.loadCategory();
  }

  publishClick() {
    if (this.form.valid) {
      const loading = this.utility.showLoading();
      loading.present();
      this.data.IsIncludePrice = this.data.Price ? true : false;
      const fileUpload = [];
      if (this.imagePath) fileUpload.push(this.uploadMediaFile('foto', this.imagePath));
      if (this.videoPath) fileUpload.push(this.uploadMediaFile('video', this.videoPath));
      new Promise((resolve, reject) => {
        if (fileUpload.length) {
          Promise.all(fileUpload)
            .then(res => {
              if (this.imagePath) {
                this.data.FotoName = res[0].name;
                this.data.FotoPath = res[0].path;
                if (this.videoPath) this.data.VideoPath = res[1].path;
              } else if (this.videoPath) this.data.VideoPath = res[0].path;
              resolve();
            })
            .catch(err => reject(err));
        } else resolve();
      })
        .then(() => this.publishProduct())
        .then(() => {
          loading.dismiss();
          this.utility.showToast('Post published');
          this.navCtrl.pop();
        })
        .catch(err => {
          loading.dismiss();
          this.utility.showToast(err);
        });
    } else this.utility.showToast(this.formValidator.getErrorMessage(this.form));
  }

  getFilePath(type: string) {
    if (this.videoPathPublic && type === 'video') this.video.nativeElement.pause();
    const loading = this.utility.showLoading();
    const oldPath = type === 'foto' ? this.imagePath : this.videoPath;
    loading.present();
    this.loadMediaFile(type === 'foto' ? this.camera.MediaType.PICTURE : this.camera.MediaType.VIDEO)
      .then(res => {
        loading.dismiss();
        if (type === 'foto') this.imagePathSecure = this.sanitization.bypassSecurityTrustStyle(`url('${this.imagePath}')`);
        else this.videoPathPublic = this.videoPath;
        this.utility.showToast(`${type.charAt(0).toUpperCase()}${type.slice(1)} loaded`);
      })
      .catch(err => {
        loading.dismiss();
        if (type === 'foto') this.imagePath = oldPath;
        else this.videoPath = oldPath;
        this.utility.showToast(err);
      });
  }

  private loadCategory() {
    this.api.get('/category').subscribe(sub => (this.listCategory = sub), err => this.utility.showToast(err));
  }

  private loadMediaFile(type) {
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        alert('Not Supported on browser');
      } else {
        const options: CameraOptions = {
          mediaType: type,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera
          .getPicture(options)
          .then(filePath => {
            if (type === this.camera.MediaType.PICTURE) {
              this.imagePath = filePath;
              return this.file.resolveLocalFilesystemUrl(filePath);
            } else {
              this.videoPath = 'file://' + filePath;
              return this.file.resolveLocalFilesystemUrl(this.videoPath);
            }
          })
          .then((res: FileEntry) => {
            if (!res) reject('Unable to load file');
            res.file(
              meta => {
                if (type === this.camera.MediaType.PICTURE) resolve();
                else {
                  if (meta.type === 'video/mp4') resolve();
                  else reject('Video not supported. Only supporting .mp4 video file');
                }
              },
              error => reject(error)
            );
          })
          .catch(error => reject(error));
      }
    });
  }

  private uploadMediaFile(type, path) {
    return new Promise((resolve, reject) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .upload(path, this.api.getUrl() + '/upload/' + type)
        .then(data => {
          resolve(JSON.parse(data.response));
        })
        .catch(error => {
          reject('An error occured, unable to upload!');
        });
    });
  }

  private publishProduct() {
    return new Promise((resolve, reject) => {
      this.api.post('/product', this.data).subscribe(sub => resolve(), err => reject(err));
    });
  }
}
