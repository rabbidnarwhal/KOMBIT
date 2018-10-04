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
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormValidatorProvider } from '../../providers/form-validator';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Config } from '../../config/config';
import { Platform } from 'ionic-angular/platform/platform';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

@IonicPage({
  name: 'newPost'
})
@Component({
  selector: 'page-post-new',
  templateUrl: 'post-new.html'
})
export class PostNewPage {
  @ViewChild('videoShow')
  video: ElementRef;
  @ViewChild('form')
  form: NgForm;

  private currency: string;
  private imagePath: string;
  private videoPath: string;
  public btnText: string;
  public pageTitle: string;
  public price: string = '';
  public segmentName: string = 'Description';

  private isVideoUpload: boolean = false;
  public supplierAsContact: boolean = true;

  public imagePathSecure: any = [];
  public attachmentFile: any = [];
  public quillUploadPromise: any = [];
  public quillIndexContainer: any = [];
  public videoPathPublic: any;
  public quill: any = {};
  public quillContent: any = {};

  private postId: number;

  public listCategory: Array<Category>;

  public data: NewProduct;

  public testImage: string;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private api: ApiServiceProvider,
    private auth: AuthServiceProvider,
    private camera: Camera,
    private dataProduct: DataProductServiceProvider,
    private file: File,
    private formValidator: FormValidatorProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private sanitization: DomSanitizer,
    private transfer: FileTransfer,
    private utility: UtilityServiceProvider
  ) {
    this.listCategory = new Array<Category>();
    this.data = new NewProduct(this.auth.getPrincipal());
    this.pageTitle = 'Create New Post';
    this.btnText = 'Publish';
    this.currency = Config.CURRENCY;
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) {
      this.pageTitle = 'Edit Post';
      this.btnText = 'Save';
      this.loadContent();
    }
    this.loadCategory();
  }

  /**
   * Generate promise for image upload in every quill editor
   */
  generateQuillImageUploadPromise() {
    for (const segment in this.quill) {
      if (this.quill.hasOwnProperty(segment)) {
        console.log(segment);
        const element = this.quill[segment];
        this.quillContent[segment] = element.getContents();
        if (this.quillContent[segment].ops.length) {
          this.quillContent[segment].ops.forEach((item, index) => {
            if (item.hasOwnProperty('insert') && item.insert.hasOwnProperty('image')) {
              this.quillIndexContainer.push({ segment: segment, index: index });
              // const makePromise = () => {
              //   return new Promise(resolve => {
              //     return setTimeout(() => {
              //       resolve('http://cuve-stockage-process-eta.com/wp-content/uploads/2018/05/test-1024x1024.png');
              //       console.log('change image');
              //     }, 1000);
              //   });
              // };
              this.quillUploadPromise.push(this.uploadMediaFile(segment, item.insert.image));
            }
          });
        }
      }
    }
  }

  quillImageUpload() {
    return new Promise((resolve, reject) => {
      Promise.all(this.quillUploadPromise)
        .then(res => {
          let oldSegment = null;
          let converter = null;
          const cfg = {};
          res.forEach((item, index) => {
            const segment = this.quillIndexContainer[index].segment;
            const contentIndex = this.quillIndexContainer[index].index;
            this.quillContent[segment].ops[contentIndex].insert.image = item;
            if (res.length - 1 === index) {
              converter = new QuillDeltaToHtmlConverter(this.quillContent[segment].ops, cfg);
              this.data[segment] = converter.convert();
            }
            if (oldSegment !== segment) {
              if (oldSegment) {
                converter = new QuillDeltaToHtmlConverter(this.quillContent[oldSegment].ops, cfg);
                this.data[oldSegment] = converter.convert();
              }
              oldSegment = segment;
            }
          });
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  addAttachmentFile() {
    const input = document.createElement('input');
    input.type = 'file';
    // input.accept = 'image/x-png,image/gif,image/jpeg';
    input.click();
    input.onchange = () => {
      console.log(input.files[0]);
      this.attachmentFile.push({ name: input.files[0].name });
    };
  }

  removeAttachmentFile(item) {
    this.utility
      .confirmAlert('Remove photo?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.attachmentFile, item);
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  editorCreated(item, segment, subSegment = null) {
    segment = subSegment || segment;
    this.quill[segment] = item;
  }

  addImageToText(segment, subSegment = null) {
    segment = subSegment || segment;
    console.log(this.quill);
    this.loadMediaFile(this.camera.MediaType.PICTURE, this.camera.PictureSourceType.PHOTOLIBRARY, true)
      .then(res => {
        const range = this.quill[segment].getSelection();
        let cursor = 0;
        if (range) {
          cursor = range.index;
        } else {
          this.quill[segment].setSelection(99999);
          cursor = this.quill[segment].getSelection(true).index;
        }
        if (!window['cordova']) {
          const reader = new FileReader();
          reader.readAsDataURL(res as Blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.quill[segment].insertEmbed(cursor, 'image', base64data);
            this.quill[segment].insertText(cursor + 1, '\n');
            this.quill[segment].setSelection(cursor + 2);
          };
        } else {
          this.quill[segment].insertEmbed(cursor, 'image', res);
          this.quill[segment].insertText(cursor + 1, '\n');
          this.quill[segment].setSelection(cursor + 2);
        }
      })
      .catch(err => this.utility.showToast(err));
  }

  private loadContent() {
    const loading = this.utility.showLoading();
    loading.present();
    this.postId = this.navParams.data.id;
    this.dataProduct
      .getProductContentEdit(this.postId)
      .then(res => {
        loading.dismiss();
        this.data.init(res);
        this.currency = this.data.Currency ? this.data.Currency : this.currency;
        this.price = this.data.Price ? '' + this.data.Price : '';
        this.commaSeparated();

        if (this.data.Foto.length) {
          this.data.Foto.map(element => {
            this.imagePathSecure.push({
              sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${element.FotoPath}')`),
              path: element.FotoPath,
              isFotoUpload: true,
              id: element.Id
            });
          });
        }

        if (this.data.VideoPath) {
          this.videoPathPublic = this.data.VideoPath;
          this.isVideoUpload = true;
        } else this.isVideoUpload = false;
      })
      .catch(err => {
        loading.dismiss();
        this.utility.showToast(err);
      });
  }

  publishClick() {
    if (this.form.valid) {
      if (this.imagePathSecure.length > 0) {
        const loading = this.utility.showLoading();
        const fileUpload = [];
        this.data.Price = +this.price.replace(this.currency + ' ', '').replace(/,/g, '');
        this.data.IsIncludePrice = this.data.Price ? true : false;
        this.data.Currency = this.currency;
        if (this.videoPath && !this.isVideoUpload) fileUpload.push(this.uploadMediaFile('video', this.videoPath));
        if (this.imagePathSecure.length) {
          this.imagePathSecure = this.imagePathSecure.map((element, index) => {
            let obj = element;
            if (!element.isFotoUpload) {
              obj.isFotoUpload = true;
              fileUpload.push(this.uploadMediaFile('foto', element.path));
            }
            return obj;
          });
        }

        loading.present();
        new Promise((resolve, reject) => {
          if (fileUpload.length) {
            Promise.all(fileUpload)
              .then(res => {
                res.map((element, index) => {
                  if (this.videoPath && index === 0) {
                    this.isVideoUpload = true;
                    this.data.VideoPath = element.path;
                    return;
                  } else
                    this.data.Foto.push({ FotoName: element.name as string, FotoPath: element.path as string, Id: 0 });
                });
                resolve();
              })
              .catch(err => reject(err));
          } else resolve();
        })
          .then(() => this.publishProduct())
          .then(data => {
            loading.dismiss();
            // this.utility.showToast(data['msg']);
            this.navCtrl.pop();
          })
          .catch(err => {
            loading.dismiss();
            this.utility.showToast(err);
          });
      } else this.utility.showToast('At least 1 photo is required');
    } else this.utility.showToast(this.formValidator.getErrorMessage(this.form));
  }

  getFilePath(type: string) {
    this.imagePath = '';
    if (this.videoPathPublic && type === 'video') this.video.nativeElement.pause();
    const loading = this.utility.showLoading();
    const oldPath = type === 'foto' ? '' : this.videoPath;
    loading.present();
    new Promise((resolve, reject) => {
      if (type === 'foto') {
        const actionSheet = this.actionSheetCtrl.create({
          title: 'Add a photo',
          buttons: [
            {
              text: 'From photo library',
              handler: () => resolve(this.camera.PictureSourceType.PHOTOLIBRARY)
            },
            {
              text: 'From camera',
              handler: () => resolve(this.camera.PictureSourceType.CAMERA)
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => reject('none')
            }
          ]
        });
        actionSheet.present();
      } else resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
    })
      .then(res =>
        this.loadMediaFile(type === 'foto' ? this.camera.MediaType.PICTURE : this.camera.MediaType.VIDEO, res)
      )
      .then((res: string) => {
        loading.dismiss();
        if (type === 'foto') {
          this.imagePath = res;
          this.imagePathSecure.push({
            isFotoUpload: false,
            path: this.imagePath,
            sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${this.imagePath}')`)
          });
        } else {
          this.videoPath = res;
          this.videoPathPublic = this.videoPath;
        }
        this.utility.showToast(`${type.charAt(0).toUpperCase()}${type.slice(1)} loaded`);
      })
      .catch(err => {
        loading.dismiss();
        if (err !== 'none') {
          if (oldPath) this.videoPath = oldPath;
          this.utility.showToast(err);
        }
      });
  }

  removeImage(image) {
    this.utility
      .confirmAlert('Remove photo?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.imagePathSecure, image);
        if (this.navParams.data.id) {
          const idx = this.data.Foto.findIndex(x => x.FotoPath === image['path']);
          if (idx !== -1) this.data.Foto[idx].FotoPath = null;
        }
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  private loadCategory() {
    this.api.get('/category').subscribe(sub => (this.listCategory = sub), err => this.utility.showToast(err));
  }

  private removeFromArray<T>(array: Array<T>, item: T) {
    const index: number = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }

  private loadMediaFile(type, source, editor = false) {
    let path = '';
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/x-png,image/gif,image/jpeg';
        input.click();
        input.onchange = () => {
          if (editor) {
            resolve(input.files[0]);
          } else {
            const blob = window.URL.createObjectURL(input.files[0]);
            resolve(blob);
          }
        };
      } else {
        const options: CameraOptions = {
          mediaType: type,
          sourceType: source,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        // if (editor) {
        //   options.destinationType = this.camera.DestinationType.DATA_URL;
        // }
        this.camera
          .getPicture(options)
          .then(filePath => {
            if (type === this.camera.MediaType.PICTURE) {
              path = this.platform.is('ios') ? filePath.replace('file://', '') : filePath;
            } else {
              path = this.platform.is('ios') ? filePath.replace('file://', '') : 'file://' + filePath;
              this.isVideoUpload = false;
            }
            return this.file.resolveLocalFilesystemUrl(path);
          })
          .then((res: FileEntry) => {
            if (!res) reject('Unable to load file');
            if (editor) {
              this.file
                .readAsDataURL(this.file.externalCacheDirectory, res.name)
                .then(dataUrl => {
                  // let fileWithoutExtension = ('' + dataUrl + '').replace(/^data:image\/(png|jpg);base64,/, '');
                  // console.log(fileWithoutExtension);
                  // console.log(dataUrl);
                  resolve(dataUrl);
                })
                .catch(err => {
                  console.log('file', err);
                  reject(err);
                });
            } else {
              res.file(
                meta => {
                  if (type === this.camera.MediaType.PICTURE) resolve(path);
                  else {
                    if (meta.type === 'video/mp4') resolve(path);
                    else reject('Video not supported. Only supporting .mp4 video file');
                  }
                },
                error => reject(error)
              );
            }
          })
          .catch(error => reject(error));
      }
    });
  }

  private uploadMediaFile(type, path): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const xhrBlob = new XMLHttpRequest();
        xhrBlob.open('GET', path, true);
        xhrBlob.responseType = 'blob';
        xhrBlob.onload = e => {
          if (xhrBlob['status'] !== 200) {
            this.utility.showToast(`Your browser doesn't support blob API`);
            console.error(e, xhrBlob);
            reject(xhrBlob);
          } else {
            const blob = xhrBlob['response'];
            const formData: FormData = new FormData();
            const xhrApi: XMLHttpRequest = new XMLHttpRequest();
            formData.append('files[]', blob);
            xhrApi.onreadystatechange = () => {
              if (xhrApi.readyState === 4) {
                if (xhrApi.status === 200) {
                  resolve(JSON.parse(xhrApi.response));
                } else reject(xhrApi);
              }
            };
            xhrApi.open('POST', this.api.getUrl() + '/upload/product/' + type, true);
            xhrApi.send(formData);
          }
        };
        xhrBlob.send();
      } else {
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer
          .upload(path, this.api.getUrl() + '/upload/product/' + type)
          .then(data => resolve(JSON.parse(data.response)))
          .catch(error => reject('An error occured, unable to upload!'));
      }
    });
  }

  private publishProduct() {
    return new Promise((resolve, reject) => {
      if (this.postId)
        this.api.post('/product/' + this.postId, this.data).subscribe(sub => resolve(sub), err => reject(err));
      else this.api.post('/product', this.data).subscribe(sub => resolve(sub), err => reject(err));
    });
  }

  public commaSeparated() {
    this.price = String(this.price)
      .replace(this.currency + ' ', '')
      .replace(/,/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.price = this.price ? this.currency + ' ' + this.price : '';
  }
}
