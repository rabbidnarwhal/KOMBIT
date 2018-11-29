import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Navbar } from 'ionic-angular';
import { User, UserRequest } from '../../models/user';
import { ApiServiceProvider } from '../../providers/api-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { NgForm } from '@angular/forms';
import { Config } from '../../config/config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DataProvinceServiceProvider } from '../../providers/dataProvince-service';
import { FormValidatorProvider } from '../../providers/form-validator';
import { ChangePassword } from '../../models/password';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public data: User;
  public isSearching: boolean = false;
  public isEdit: boolean = false;
  public isPasswordEdit: boolean = false;
  private id: number = 0;
  public listCompany: any = [];
  public listHoldingCompany: any = [];
  public mapImage: string;
  public picture: any;
  public city: string;
  public confirmPassword: string;
  public password: ChangePassword;
  @ViewChild('formProfile') form: NgForm;
  @ViewChild('formPassword') formPassword: NgForm;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private api: ApiServiceProvider,
    private utility: UtilityServiceProvider,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    private dataProvince: DataProvinceServiceProvider,
    private formValidator: FormValidatorProvider
  ) {
    this.data = new User();
    this.password = new ChangePassword();
    this.picture = 'assets/imgs/profile.png';
    this.id = this.navParams.data.id;
  }

  ionViewDidLoad() {
    const loading = this.utility.showLoading();
    loading.present();
    this.isSearching = true;
    this.loadUserData()
      .then(() => {
        loading.dismiss();
        this.isSearching = false;
        this.loadListHoldingCompany();
        this.loadListCompany();
      })
      .catch((err) => {
        loading.dismiss();
        this.isSearching = false;
        this.utility.showToast(err);
      });

    this.navBar.backButtonClick = () => {
      if (!this.isEdit && !this.isPasswordEdit) this.navCtrl.pop();
      else {
        this.isEdit = false;
        this.isPasswordEdit = false;
      }
    };
  }

  ionViewWillUnload() {}

  createMap() {
    const position = this.data.addressKoordinat ? this.data.addressKoordinat.split(', ') : [];
    if (position.length)
      this.mapImage =
        'https://maps.googleapis.com/maps/api/staticmap?center=' +
        position[0] +
        ',' +
        position[1] +
        '&markers=color:orange%7Clabel:C%7C' +
        position[0] +
        ',' +
        position[1] +
        '&zoom=12&size=360x216&key=' +
        Config.GOOGLE_MAP_API_KEY;
  }

  edit(type) {
    this.isEdit = type === 'content' ? true : false;
    this.isPasswordEdit = type === 'password' ? true : false;
  }

  save() {
    const loading = this.utility.showLoading();
    loading.present();
    this.saveProfile()
      .then(() => this.loadUserData())
      .then(() => {
        loading.dismiss();
        this.isEdit = false;
      })
      .catch((err) => {
        loading.dismiss();
        this.utility.showToast(err);
      });
  }

  savePassword() {
    const loading = this.utility.showLoading();
    loading.present();
    this.formPassword.ngSubmit;
    if (this.formPassword.valid) {
      if (this.password.New === this.confirmPassword) {
        this.changePassword(this.password)
          .then((res) => {
            loading.dismiss();
            this.isPasswordEdit = false;
            this.utility.showToast('Password changed!');
          })
          .catch((err) => {
            loading.dismiss();
            this.utility.showToast(err);
          });
      }
    } else this.formValidator.getErrorMessage(this.formPassword);
  }

  private changePassword(request: ChangePassword) {
    request.UserName = this.data.username;
    return this.api.post('/users/' + this.data.id + '/change-password', request).toPromise();
  }

  openMap(type) {
    this.navCtrl.push('map-location', { type: type, coordinate: this.data.addressKoordinat });

    this.events.subscribe('location', (res) => {
      this.data.addressKoordinat = res.coordinate;
      this.events.unsubscribe('location');
    });
  }

  selectCity() {
    this.navCtrl.push('searchable-select', { type: 'province' });

    this.events.subscribe('province-location', (sub) => {
      this.city = `${sub.city.name}, ${sub.province.name}`;
      this.data.provinsiId = sub.province.id;
      this.data.kabKotaId = sub.city.id;
      this.events.unsubscribe('province-location');
    });
  }

  changeCompany() {
    this.loadListCompany();
  }

  private loadUserData() {
    return new Promise((resolve, reject) => {
      const header = { 'Cache-Control': 'no-cache' };
      this.api.get('/users/' + this.id, { headers: header }).subscribe(
        (sub) => {
          this.data = sub;
          if (this.data.kabKotaId && this.data.provinsiId) {
            Promise.all([ this.dataProvince.getCity(), this.dataProvince.getProvince() ]).then((res) => {
              const city = res[0].filter((x) => x.id === this.data.kabKotaId);
              const province = res[1].filter((x) => x.id === this.data.provinsiId);
              this.city = `${city[0].name}, ${province[0].name}`;
            });
          }
          this.createMap();
          this.picture = this.data.image ? this.data.image : 'assets/imgs/profile.png';
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  private loadListCompany() {
    this.api
      .get('/holding/' + this.data.holdingId + '/company')
      .subscribe((sub) => (this.listCompany = sub), (err) => this.utility.showToast(err));
  }

  private loadListHoldingCompany() {
    this.api.get('/holding').subscribe((sub) => (this.listHoldingCompany = sub), (err) => this.utility.showToast(err));
  }

  private saveProfile() {
    return new Promise((resolve, reject) => {
      const request: UserRequest = new UserRequest(this.data);
      this.api.post('/users/' + this.id, request).subscribe(
        (sub) => {
          resolve();
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  private changePicture(image): Promise<any> {
    const loading = this.utility.showLoading();
    loading.present();
    return new Promise((resolve, reject) => {
      if (!window['cordova']) {
        const xhrBlob = new XMLHttpRequest();
        xhrBlob.open('GET', image, true);
        xhrBlob.responseType = 'blob';
        xhrBlob.onload = (e) => {
          if (xhrBlob['status'] !== 200) {
            this.utility.showToast(`Your browser doesn't support blob API`);
            reject(xhrBlob);
          } else {
            const blob = xhrBlob['response'];
            const formData: FormData = new FormData();
            const xhrApi: XMLHttpRequest = new XMLHttpRequest();
            formData.append('files[]', blob);
            xhrApi.onreadystatechange = () => {
              if (xhrApi.readyState === 4) {
                if (xhrApi.status === 200) {
                  loading.dismiss();
                  resolve(JSON.parse(xhrApi.response));
                } else {
                  loading.dismiss();
                  reject(xhrApi);
                }
              }
            };
            xhrApi.open('POST', this.api.getUrl() + '/upload/user/' + this.id, true);
            xhrApi.send(formData);
          }
        };
        xhrBlob.send();
      } else {
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer
          .upload(image, this.api.getUrl() + '/upload/user/' + this.id)
          .then((data) => {
            loading.dismiss();
            resolve(JSON.parse(data.response));
          })
          .catch((error) => {
            loading.dismiss();
            reject(error);
          });
      }
    });
  }

  selectPicture() {
    new Promise((resolve, reject) => {
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
    })
      .then((sourceType) => {
        if (!window['cordova']) {
          return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/x-png,image/gif,image/jpeg';
            input.click();
            input.onchange = () => {
              const blob = window.URL.createObjectURL(input.files[0]);
              resolve(blob);
            };
          });
        } else {
          const options: CameraOptions = {
            quality: 80,
            sourceType: sourceType as number,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };
          return this.camera.getPicture(options);
        }
      })
      .then((imagePath) => this.changePicture(imagePath))
      .then((data) => {
        this.picture = data.path;
        this.events.publish('picture-changed', data.path);
      })
      .catch((error) => {
        if (error !== 'none') {
          console.error('Error: ', error);
          this.utility.showToast(error);
        }
      });
  }
}
