import { ApiServiceProvider } from '../../providers/api-service';
import { AuthServiceProvider } from '../../providers/auth-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Category } from '../../models/category';
import { NewProduct, AttachmentFile } from '../../models/products';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormValidatorProvider } from '../../providers/form-validator';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Config } from '../../config/config';
import { Platform } from 'ionic-angular/platform/platform';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';

const ATTRIBUTES = ['alt', 'height', 'width'];

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

  public imagePathSecure: Array<any> = [];
  public attachmentFile: Array<any> = [];
  public fileUpload: Array<any> = [];
  public listUser: Array<{ id: number; name: string }> = [];

  public videoPathPublic: any;
  public intervalPublish: any;
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
    private filePath: FilePath,
    private formValidator: FormValidatorProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private sanitization: DomSanitizer,
    private transfer: FileTransfer,
    private utility: UtilityServiceProvider,
    private filePicker: IOSFilePicker,
    private fileChooser: FileChooser
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
    this.loadUser();
  }

  /** Add attachment file */
  addAttachmentFile() {
    const resolveFileUrl = uri => {
      this.filePath
        .resolveNativePath(uri)
        .then(file => {
          const fileName = file.split('/');
          this.attachmentFile.push({ path: file, name: fileName[fileName.length - 1] });
        })
        .catch(err => this.utility.showToast(err));
    };

    if (window['cordova'] && this.platform.is('ios')) {
      this.filePicker.pickFile().then(uri => resolveFileUrl(uri));
    } else if (window['cordova'] && this.platform.is('android')) {
      this.fileChooser.open().then(uri => resolveFileUrl(uri));
    } else if (!window['cordova']) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept =
        'image/x-png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
      input.click();
      input.onchange = () => {
        const blob = window.URL.createObjectURL(input.files[0]);
        this.attachmentFile.push({ path: blob, name: input.files[0].name });
      };
    }
  }

  /** Event handler when attachment file removed. */
  removeAttachmentFile(item: any) {
    this.utility
      .confirmAlert('Remove file?', '', 'Yes', 'No')
      .then(() => this.removeFromArray(this.attachmentFile, item))
      .catch(err => console.error(err));
  }

  /** Event handler when quill is created. */
  editorCreated(item: QuillEditorComponent, segment: string, subSegment: string = null) {
    segment = subSegment || segment;
    this.quill[segment] = item;
  }

  /** Add image to quill editor. */
  addImageToText(segment: string, subSegment: string = null) {
    segment = subSegment || segment;
    this.loadMediaFile(this.camera.MediaType.PICTURE, this.camera.PictureSourceType.PHOTOLIBRARY)
      .then(res => {
        const range = this.quill[segment].getSelection();
        let cursor = 0;
        if (range) cursor = range.index;
        else {
          /** set cursor position at the end of editor */
          this.quill[segment].setSelection(99999);
          cursor = this.quill[segment].getSelection(true).index;
        }
        this.quill[segment].insertEmbed(cursor, 'imageurl', res);
        this.quill[segment].setSelection(cursor + 1);
      })
      .catch(err => this.utility.showToast(err));
  }

  /** Event handler when publish button clicked */
  publishClick() {
    if (this.form.valid) {
      if (this.imagePathSecure.length > 0) {
        const loading = this.utility.showLoading();
        this.data.Price = +this.price.replace(this.currency + ' ', '').replace(/,/g, '');
        this.data.IsIncludePrice = this.data.Price ? true : false;
        this.data.Currency = this.currency;

        /** Add to upload que if there is a video and had not been uploaded. */
        if (this.videoPath && !this.isVideoUpload)
          this.fileUpload.push(this.uploadMediaFile('video', this.videoPath, 'video'));

        /** Add to upload que if there is a foto and had not been uploaded. */
        if (this.imagePathSecure.length) {
          this.imagePathSecure = this.imagePathSecure.map((element, index) => {
            let obj = element;
            if (!element.isFotoUpload) {
              obj.isFotoUpload = true;
              this.fileUpload.push(this.uploadMediaFile('foto', element.path, 'foto'));
            }
            return obj;
          });
        }

        /** Add to upload que if there is an attachment file and not had been uploaded. */
        if (this.attachmentFile.length) {
          this.attachmentFile.forEach(element => {
            this.fileUpload.push(this.uploadMediaFile('kit', element.path, 'attachment'));
          });
        }

        /** Add to upload que if there is an image file in quill editor. */
        this.generateQuillImageUploadPromise();
        loading.present();
        console.log('file', this.fileUpload);
        new Promise((resolve, reject) => {
          if (this.fileUpload.length) {
            Promise.all(this.fileUpload)
              .then(res => {
                let kitCount = 0;
                res.map((element, index) => {
                  const segment = element.useCase;
                  if (segment === 'video') {
                    this.isVideoUpload = true;
                    this.data.VideoPath = element.path;
                  } else if (segment === 'foto') {
                    this.data.Foto.push({
                      FotoName: element.name as string,
                      FotoPath: element.path as string,
                      Id: 0,
                      UseCase: element.useCase as string
                    });
                  } else if (segment === 'attachment') {
                    this.data.Attachment.push({
                      FileName: this.attachmentFile[kitCount].name,
                      FilePath: element.path as string,
                      Id: 0
                    });
                    kitCount++;
                  } else {
                    const contentIndex = element.quillIndex;
                    this.quillContent[segment].ops[contentIndex].insert = { image: element.path };
                  }
                });
                resolve();
              })
              .catch(err => reject(err));
          } else resolve();
        })
          .then(() => this.publishProduct())
          .then(data => {
            console.log('end data', this.data);
            loading.dismiss();
            this.navCtrl.pop();
          })
          .catch(err => {
            loading.dismiss();
            this.utility.showToast(err);
          });
      } else this.utility.showToast('At least 1 photo is required');
    } else this.utility.showToast(this.formValidator.getErrorMessage(this.form));
  }

  /** Open action sheet to choose where foto source. */
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
      .then((res: number) =>
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

  /** Remove foto image from list. */
  removeImage(image: any) {
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

  /** Fetch list category/solution from server. */
  private loadCategory() {
    this.api.get('/category').subscribe(sub => (this.listCategory = sub), err => this.utility.showToast(err));
  }

  /** Fetch list user from server. */
  private loadUser() {
    this.api
      .get('/users/list/' + this.auth.getPrincipal().id)
      .subscribe(sub => (this.listUser = sub), err => this.utility.showToast(err));
  }

  /** Load product detail for update purpose. */
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

  /** Remove object from array. */
  private removeFromArray<T>(array: Array<T>, item: T) {
    const index: number = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }

  /** Open media file chooser. */
  private loadMediaFile(type: number, source: number): Promise<string> {
    let path = '';
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/x-png,image/gif,image/jpeg';
        input.click();
        input.onchange = () => {
          const blob = window.URL.createObjectURL(input.files[0]);
          resolve(blob);
        };
      } else {
        const options: CameraOptions = {
          mediaType: type,
          sourceType: source,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
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
            res.file(
              meta => {
                if (type === this.camera.MediaType.PICTURE) resolve(res.nativeURL);
                else if (meta.type === 'video/mp4') resolve(res.nativeURL);
                else reject('Video not supported. Only supporting .mp4 video file');
              },
              error => reject(error.message)
            );
          })
          .catch(error => reject(error));
      }
    });
  }

  /** Generate promise for image upload in every quill editor */
  private generateQuillImageUploadPromise() {
    for (const segment in this.quill) {
      if (this.quill.hasOwnProperty(segment)) {
        const element = this.quill[segment];
        this.quillContent[segment] = element.getContents();
        if (this.quillContent[segment].ops.length) {
          this.quillContent[segment].ops.forEach((item, index) => {
            if (item.hasOwnProperty('insert') && item.insert.hasOwnProperty('imageurl')) {
              this.fileUpload.push(this.uploadMediaFile('foto', item.insert.imageurl, segment, index));
            }
          });
        }
      }
    }
  }

  /** Upload file. */
  private uploadMediaFile(
    type: string,
    path: string,
    useCase: string,
    quillIndex: number = 0
  ): Promise<{ path: string; name: string; useCase: string; quillIndex: number }> {
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const xhrBlob = new XMLHttpRequest();
        xhrBlob.open('GET', path, true);
        xhrBlob.responseType = 'blob';
        xhrBlob.onload = e => {
          if (xhrBlob.status !== 200) {
            this.utility.showToast(`Your browser doesn't support blob API`);
            reject(xhrBlob);
          } else {
            const blob = xhrBlob['response'];
            const formData: FormData = new FormData();
            const xhrApi: XMLHttpRequest = new XMLHttpRequest();
            formData.append('File', blob);
            formData.append('UserId', this.data.UserId + '');
            formData.append('UseCase', useCase);
            formData.append('Type', type);
            xhrApi.onreadystatechange = () => {
              if (xhrApi.readyState === 4) {
                if (xhrApi.status === 200) {
                  let response = JSON.parse(xhrApi.response);
                  response['useCase'] = useCase;
                  response['quillIndex'] = quillIndex;
                  resolve(response);
                } else reject(xhrApi);
              }
            };
            xhrApi.open('POST', this.api.getUrl() + '/upload/product/', true);
            xhrApi.send(formData);
          }
        };
        xhrBlob.send();
      } else {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
          fileKey: 'File',
          params: {
            UserId: this.data.UserId,
            UseCase: useCase,
            Type: type
          }
        };
        fileTransfer
          .upload(path, this.api.getUrl() + '/upload/product/', options)
          .then(data => {
            let response = JSON.parse(data.response);
            response['useCase'] = useCase;
            response['quillIndex'] = quillIndex;
            resolve(response);
          })
          .catch(error => reject('An error occured, unable to upload!'));
      }
    });
  }

  /** Send product data to server. */
  private publishProduct() {
    if (this.supplierAsContact) this.data.UserId = this.data.PosterId;
    for (const segment in this.quill) {
      if (this.quillContent.hasOwnProperty(segment)) {
        const converter = new QuillDeltaToHtmlConverter(this.quillContent[segment].ops, {});
        this.data[segment] = converter.convert();
      }
    }
    if (this.postId) {
      return this.api.post('/product/' + this.postId, this.data).toPromise();
    } else {
      return this.api.post('/product', this.data).toPromise();
    }
  }

  /** Add or remove comma in price. */
  public commaSeparated() {
    this.price = String(this.price)
      .replace(this.currency + ' ', '')
      .replace(/,/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.price = this.price ? this.currency + ' ' + this.price : '';
  }
}

/** Register quill format */
const BlockEmbed = Quill.import('blots/block/embed');
class ImageUrl extends BlockEmbed {
  static blotName = 'imageurl';
  static tagName = 'IMG';
  static create(value) {
    let node = super.create(value);
    node.setAttribute('src', value);
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }
}
Quill.register(ImageUrl);
