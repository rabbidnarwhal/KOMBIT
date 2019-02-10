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
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormValidatorProvider } from '../../providers/form-validator';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Config } from '../../config/config';
import { Platform } from 'ionic-angular/platform/platform';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { Contacts } from '@ionic-native/contacts';

import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import { BehaviorSubject } from 'rxjs/rx';

const ATTRIBUTES = [ 'alt', 'height', 'width' ];

@IonicPage()
@Component({
  selector: 'page-post-new',
  templateUrl: 'post-new.html'
})
export class PostNewPage {
  @ViewChild('videoShow') video: ElementRef;
  @ViewChild('form') form: NgForm;

  public marketingModalData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public contactModalToggle: BehaviorSubject<number> = new BehaviorSubject(0);

  private currency: string;
  private imagePath: string;
  private videoPath: string;
  public btnText: string;
  public contactLabel: string = 'Add Contact Person';
  public pageTitle: string;
  public price: string = '';
  public segmentName: string = 'Description';

  private isVideoUpload: boolean = false;
  public contactIsSelectable: boolean = false;

  public imagePathSecure: Array<any> = [];
  public implementationPathSecure: Array<any> = [];
  public clientPathSecure: Array<any> = [];
  public certificatePathSecure: Array<any> = [];

  public attachmentFile: Array<any> = [];
  public fileUpload: Array<any> = [];
  public listUser: Array<{ id: number; name: string; handphone: string }> = [];

  public videoPathPublic: any;
  public intervalPublish: any;
  public quill: any = {};
  public quillContent: any = {};

  private postId: number;
  public contactToggle: number = 0;

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
    private utility: UtilityServiceProvider,
    private contacts: Contacts
  ) {
    this.listCategory = new Array<Category>();
    this.data = new NewProduct(this.auth.getPrincipal());
    this.pageTitle = 'Create New Post';
    this.btnText = 'Publish';
    this.currency = Config.CURRENCY;
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) {
      this.postId = this.navParams.data.id;
      this.pageTitle = 'Edit Post';
      this.btnText = 'Save';
      this.loadContent();
    }
    this.loadCategory();
    this.loadUser();

    this.marketingModalSubs();
    this.contactModalSubs();
  }

  private marketingModalSubs() {
    this.marketingModalData.subscribe((data) => {
      this.attachmentFile = [ ...this.attachmentFile, ...data ];
    });
  }

  private contactModalSubs() {
    this.contactModalToggle.subscribe((data) => {
      this.contactToggle = data;
      this.contactIsSelectable = false;
      if (data) {
        this.contactLabel = 'Change Contact Person';
        if (data === 1) {
          this.contactIsSelectable = true;
          this.data.ContactHandphone = this.auth.getPrincipal().phoneNumber;
          this.data.ContactName = this.auth.getPrincipal().name;
          this.data.ContactId = this.auth.getPrincipal().id;
        } else if (data === 2) {
          this.contacts.pickContact().then((contact) => {
            this.data.ContactName = contact.name.formatted;
            const phone = contact.phoneNumbers.filter((x) => {
              x.type === 'mobile';
            });
            this.data.ContactHandphone = phone.length ? phone[0].value : contact.phoneNumbers[0].value;
          });
          this.data.ContactId = 0;
        } else {
          this.data.ContactId = 0;
          this.data.ContactHandphone = '';
          this.data.ContactName = '';
        }
      }
    });
  }

  /** Fetch list category/solution from server. */
  private loadCategory() {
    this.api.get('/category').subscribe((sub) => (this.listCategory = sub), (err) => this.utility.showToast(err));
  }

  /** Fetch list user from server. */
  private loadUser() {
    this.api.get('/users/list/').subscribe((sub) => (this.listUser = sub), (err) => this.utility.showToast(err));
  }

  contactChanged(e) {
    const selectedContact = this.listUser.filter((x) => x.id === e);
    this.data.ContactId = selectedContact[0].id;
    this.data.ContactHandphone = selectedContact[0].handphone;
    this.data.ContactName = selectedContact[0].name;
  }

  /** Load product detail for update purpose. */
  private loadContent() {
    const loading = this.utility.showLoading();
    loading.present();
    this.dataProduct
      .getProductContentEdit(this.postId)
      .then((res) => {
        loading.dismiss();
        this.data.init(res);
        this.contactToggle = 1;
        this.currency = this.data.Currency ? this.data.Currency : this.currency;
        this.price = this.data.Price ? '' + this.data.Price : '';
        this.commaSeparated();

        if (this.data.Foto.length) {
          this.data.Foto.map((element) => {
            this.imagePathSecure.push({
              sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${element.FotoPath}')`),
              path: element.FotoPath,
              isFotoUpload: true,
              id: element.Id
            });
          });
        }

        if (this.data.ProductCertificate.length) {
          this.data.ProductCertificate.map((element) => {
            this.certificatePathSecure.push({
              sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${element.FotoPath}')`),
              path: element.FotoPath,
              isUpload: true,
              id: element.Id
            });
          });
        }

        if (this.data.ProductClient.length) {
          this.data.ProductClient.map((element) => {
            this.clientPathSecure.push({
              sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${element.FotoPath}')`),
              path: element.FotoPath,
              isUpload: true,
              id: element.Id
            });
          });
        }

        if (this.data.ProductImplementation.length) {
          this.data.ProductImplementation.map((element) => {
            this.implementationPathSecure.push({
              title: element.Title,
              sanitize:
                element.UseCase === 'implementationVideo'
                  ? element.FotoPath
                  : this.sanitization.bypassSecurityTrustStyle(`url('${element.FotoPath}')`),
              path: element.FotoPath,
              isUpload: true,
              id: element.Id,
              type: element.UseCase
            });
          });
        }

        if (this.data.VideoPath) {
          this.videoPathPublic = this.data.VideoPath;
          this.isVideoUpload = true;
        } else this.isVideoUpload = false;

        if (this.data.Attachment.length) {
          this.attachmentFile = this.data.Attachment.map((element) => {
            const attachment = {
              path: element.FilePath,
              name: element.FileName,
              isUploaded: true,
              type: element.FileType
            };
            return attachment;
          });
        }
      })
      .catch((err) => {
        loading.dismiss();
        this.utility.showToast(err);
      });
  }

  openModalMarketingKit() {
    const popover = this.utility.showPopover(
      'ModalMarketingKitPage',
      { optionSubject: this.marketingModalData },
      'popover-width-marketing-kit',
      true,
      false
    );
    popover.present();
  }

  openModalContact() {
    const popover = this.utility.showPopover(
      'ModalContactPage',
      {
        optionSubject: this.contactModalToggle,
        contact: {
          name: this.auth.getPrincipal().name,
          phone: this.auth.getPrincipal().phoneNumber
        }
      },
      'popover-width-contact',
      true,
      false
    );
    popover.present();
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
      .then((res) => {
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
      .catch((err) => this.utility.showToast(err));
  }

  /** Open action sheet to choose where foto source. */
  getFilePath(type: string) {
    this.imagePath = '';
    if (this.videoPathPublic && type === 'video') this.video.nativeElement.pause();
    // const loading = this.utility.showLoading();
    const oldPath = type === 'foto' ? '' : this.videoPath;
    // loading.present();
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
      } else if (type === 'implementation') {
        const actionSheet = this.actionSheetCtrl.create({
          title: 'Select Media',
          buttons: [
            {
              text: 'Image',
              handler: () => {
                type = 'implementationImage';
                resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
            },
            {
              text: 'Video',
              handler: () => {
                type = 'implementationVideo';
                resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => reject('none')
            }
          ]
        });
        actionSheet.present();
      } else {
        resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
      }
    })
      .then((res: number) =>
        this.loadMediaFile(
          type.toLowerCase().includes('video') ? this.camera.MediaType.VIDEO : this.camera.MediaType.PICTURE,
          res
        )
      )
      .then((res: string) => {
        // loading.dismiss();
        if (type === 'foto') {
          this.imagePath = res;
          this.imagePathSecure.push({
            isFotoUpload: false,
            path: this.imagePath,
            sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${this.imagePath}')`)
          });
        } else if (type === 'video') {
          this.videoPath = res;
          this.videoPathPublic = this.sanitization.bypassSecurityTrustUrl(this.videoPath);
        } else if (type === 'client') {
          this.clientPathSecure.push({
            isUpload: false,
            path: res,
            sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${res}')`)
          });
        } else if (type === 'certificate') {
          this.certificatePathSecure.push({
            isUpload: false,
            path: res,
            sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${res}')`)
          });
        } else if (type === 'implementationVideo') {
          this.implementationPathSecure.push({
            isUpload: false,
            path: res,
            sanitize: this.sanitization.bypassSecurityTrustUrl(res),
            type: type,
            title: ''
          });
        } else if (type === 'implementationImage') {
          this.implementationPathSecure.push({
            isUpload: false,
            path: res,
            sanitize: this.sanitization.bypassSecurityTrustStyle(`url('${res}')`),
            type: type,
            title: ''
          });
        }
        this.utility.showToast(`${type.charAt(0).toUpperCase()}${type.slice(1)} loaded`);
      })
      .catch((err) => {
        // loading.dismiss();
        if (err !== 'none') {
          if (oldPath) this.videoPath = oldPath;
          this.utility.showToast(err);
        }
      });
  }

  /** Open media file chooser. */
  private loadMediaFile(type: number, source: number): Promise<string> {
    let path = '';
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const input = document.createElement('input');
        input.type = 'file';
        if (type === this.camera.MediaType.PICTURE) {
          input.accept = 'image/x-png,image/gif,image/jpeg';
        } else {
          input.accept = 'video/mp4';
        }
        input.click();
        input.onchange = (event) => {
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
          .then((filePath) => {
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
              (meta) => {
                if (type === this.camera.MediaType.PICTURE) resolve(res.nativeURL);
                else if (meta.hasOwnProperty('type')) {
                  if (meta.type === 'video/mp4') resolve(res.nativeURL);
                } else {
                  if (res.nativeURL.includes('.mp4')) resolve(res.nativeURL);
                  else reject('Video not supported. Only supporting .mp4 video file');
                }
              },
              (error) => reject(error.message)
            );
          })
          .catch((error) => reject(error));
      }
    });
  }

  /** Event handler when publish button clicked */
  publishClick() {
    if (
      this.form.valid &&
      this.imagePathSecure.length > 0 &&
      this.data.ContactName &&
      this.data.ContactHandphone &&
      this.data.Description
    ) {
      const loading = this.utility.showLoading();
      this.data.Price = +this.price.replace(this.currency + ' ', '').replace(/,/g, '');
      this.data.IsIncludePrice = this.data.Price ? true : false;
      this.data.Currency = this.currency;
      if (this.data.ContactHandphone[0] === '0') {
        this.data.ContactHandphone = '62' + this.data.ContactHandphone.slice(1);
      } else if (this.data.ContactHandphone[0] === '+') {
        this.data.ContactHandphone = this.data.ContactHandphone.slice(1);
      }

      /** Add to upload que if there is a video and had not been uploaded. */
      if (this.videoPath && !this.isVideoUpload)
        this.fileUpload.push(this.uploadMediaFile('video', this.videoPath, 'video'));

      /** Add to upload que if there is a foto and had not been uploaded. */
      if (this.imagePathSecure.length) {
        this.imagePathSecure = this.imagePathSecure.map((element) => {
          let obj = element;
          if (!element.isFotoUpload) {
            this.fileUpload.push(this.uploadMediaFile('foto', element.path, 'foto'));
          }
          return obj;
        });
      }
      let implementationExtend = new Array<any>();
      if (this.implementationPathSecure.length) {
        this.implementationPathSecure = this.implementationPathSecure.map((element) => {
          let obj = element;
          if (!element.isUpload) {
            this.fileUpload.push(this.uploadMediaFile('foto', element.path, element.type));
            implementationExtend.push({ title: element.title });
          }
          return obj;
        });
      }

      if (this.clientPathSecure.length) {
        this.clientPathSecure = this.clientPathSecure.map((element) => {
          let obj = element;
          if (!element.isUpload) {
            this.fileUpload.push(this.uploadMediaFile('foto', element.path, 'client'));
          }
          return obj;
        });
      }

      if (this.certificatePathSecure.length) {
        this.certificatePathSecure = this.certificatePathSecure.map((element) => {
          let obj = element;
          if (!element.isUpload) {
            this.fileUpload.push(this.uploadMediaFile('foto', element.path, 'certificate'));
          }
          return obj;
        });
      }

      /** Add to upload que if there is an attachment file and not had been uploaded. */
      let attachmentExtend = new Array<any>();
      if (this.attachmentFile.length) {
        this.attachmentFile = this.attachmentFile.map((element) => {
          const obj = element;
          if (!element.isUploaded) {
            this.fileUpload.push(this.uploadMediaFile('kit', element.path, 'attachment'));
            attachmentExtend.push({ name: element.name, type: element.type });
          }
          return obj;
        });
      }

      /** Add to upload que if there is an image file in quill editor. */
      this.generateQuillImageUploadPromise();
      loading.present();

      new Promise((resolve, reject) => {
        if (this.fileUpload.length) {
          Promise.all(this.fileUpload)
            .then((res) => {
              let kitCount = 0;
              let implementationCount = 0;
              res.map((element, index) => {
                const segment = element.useCase;
                if (segment === 'video') {
                  this.isVideoUpload = true;
                  this.data.VideoPath = element.path;
                } else if (segment === 'foto') {
                  this.imagePathSecure[element.index].isFotoUpload = true;
                  this.data.Foto.push({
                    FotoName: element.name as string,
                    FotoPath: element.path as string,
                    Id: 0,
                    UseCase: element.useCase as string
                  });
                } else if (segment === 'attachment') {
                  this.attachmentFile[element.index].isUploaded = true;
                  this.data.Attachment.push({
                    FileType: attachmentExtend[kitCount].type,
                    FileName: attachmentExtend[kitCount].name,
                    FilePath: element.path as string,
                    Id: 0
                  });
                  kitCount++;
                } else if (segment === 'client') {
                  this.clientPathSecure[element.index].isUpload = true;
                  this.data.ProductClient.push({
                    FotoName: element.name as string,
                    FotoPath: element.path as string,
                    Id: 0,
                    UseCase: element.useCase as string
                  });
                } else if (segment === 'certificate') {
                  this.certificatePathSecure[element.index].isUpload = true;
                  this.data.ProductCertificate.push({
                    FotoName: element.name as string,
                    FotoPath: element.path as string,
                    Id: 0,
                    UseCase: element.useCase as string
                  });
                } else if (segment === 'implementationVideo' || segment === 'implementationImage') {
                  this.implementationPathSecure[element.index].isUpload = true;
                  this.data.ProductImplementation.push({
                    Title: implementationExtend[implementationCount].title,
                    FotoName: element.name as string,
                    FotoPath: element.path as string,
                    Id: 0,
                    UseCase: element.useCase as string
                  });
                  implementationCount++;
                } else {
                  const contentIndex = element.index;
                  this.quillContent[segment].ops[contentIndex].insert = { image: element.path };
                }
              });
              resolve();
            })
            .catch((err) => reject(err));
        } else resolve();
      })
        .then(() => this.publishProduct())
        .then((data) => {
          loading.dismiss();
          this.navCtrl.pop();
        })
        .catch((err) => {
          loading.dismiss();
          this.utility.showToast(err);
        });
    } else {
      if (!this.form.valid) this.utility.showToast(this.formValidator.getErrorMessage(this.form));
      else if (this.imagePathSecure.length === 0) this.utility.showToast('At least 1 photo is required');
      else if (!this.data.ContactName || !this.data.ContactHandphone) this.utility.showToast('Contact is required');
      else if (!this.data.Description) this.utility.showToast('Description is required');
    }
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
              if (!item.insert.imageurl.includes('http://') && !item.insert.imageurl.includes('https://'))
                this.fileUpload.push(this.uploadMediaFile('foto', item.insert.imageurl, segment, index));
              else item.insert = { image: item.insert.imageurl };
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
    index: number = 0
  ): Promise<{ path: string; name: string; useCase: string; index: number }> {
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        this.api
          .getBlob(path)
          .toPromise()
          .then((blob) => {
            const formData: FormData = new FormData();
            formData.append('File', blob);
            formData.append('UserId', this.data.PosterId + '');
            formData.append('UseCase', useCase);
            formData.append('Type', type);
            formData.append('ProductName', this.data.ProductName.toLowerCase().replace(' ', '-'));
            return this.api.postFormData('/upload/product/', formData).toPromise();
          })
          .then((response) => {
            response['useCase'] = useCase;
            response['index'] = index;
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options: FileUploadOptions = {
          fileKey: 'File',
          params: {
            UserId: this.data.PosterId,
            UseCase: useCase,
            Type: type,
            ProductName: this.data.ProductName.toLowerCase().replace(' ', '-')
          }
        };
        fileTransfer
          .upload(path, this.api.getUrl() + '/upload/product/', options)
          .then((data) => {
            let response = JSON.parse(data.response);
            response['useCase'] = useCase;
            response['index'] = index;
            resolve(response);
          })
          .catch((error) => reject('An error occured when trying to upload, due: ' + error.toString()));
      }
    });
  }

  /** Send product data to server. */
  private publishProduct() {
    if (!this.data.ContactId) {
      this.data.ContactId = this.data.PosterId;
      this.data.PosterAsContact = false;
    } else {
      this.data.PosterAsContact = this.data.ContactId === this.data.PosterId ? true : false;
    }
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

  /** Remove foto image from list. */
  removeImage(image: any) {
    this.utility
      .confirmAlert('Remove photo?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.imagePathSecure, image);
        if (this.postId) {
          const idx = this.data.Foto.findIndex((x) => x.FotoPath === image['path']);
          if (idx !== -1) this.data.Foto[idx].FotoPath = null;
        }
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  removeCertificate(image: any) {
    this.utility
      .confirmAlert('Remove certificate?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.certificatePathSecure, image);
        if (this.postId) {
          const idx = this.data.ProductCertificate.findIndex((x) => x.FotoPath === image['path']);
          if (idx !== -1) this.data.ProductCertificate[idx].FotoPath = null;
        }
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  removeImplementation(file: any) {
    this.utility
      .confirmAlert('Remove implementation?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.implementationPathSecure, file);
        if (this.postId) {
          const idx = this.data.ProductImplementation.findIndex((x) => x.FotoPath === file['path']);
          if (idx !== -1) this.data.ProductImplementation[idx].FotoPath = null;
        }
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  removeClient(image: any) {
    this.utility
      .confirmAlert('Remove client?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.clientPathSecure, image);
        if (this.postId) {
          const idx = this.data.ProductClient.findIndex((x) => x.FotoPath === image['path']);
          if (idx !== -1) this.data.ProductClient[idx].FotoPath = null;
        }
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }

  /** Event handler when attachment file removed. */
  removeAttachmentFile(item: any) {
    this.utility
      .confirmAlert('Remove file?', '', 'Yes', 'No')
      .then(() => {
        this.removeFromArray(this.attachmentFile, item);
        if (this.postId) {
          const idx = this.data.Attachment.findIndex((x) => x.FilePath === item['path']);
          if (idx !== -1) this.data.Attachment[idx].FilePath = null;
        }
      })
      .catch((err) => console.error(err));
  }

  /** Remove object from array. */
  private removeFromArray<T>(array: Array<T>, item: T) {
    const index: number = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
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
/** END CLASS */

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
