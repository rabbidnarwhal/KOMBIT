import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { Events } from 'ionic-angular/util/events';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Injectable()
export class UtilityServiceProvider {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private events: Events
  ) {}

  showToast(
    content: string,
    duration = 5000,
    onDidDismis = false,
    position = 'top',
    closeButton = true,
    closeButtonText = 'Ok'
  ): void {
    const toast = this.toastCtrl.create({
      message: content,
      position: position,
      duration: duration,
      showCloseButton: closeButton,
      closeButtonText: closeButtonText
    });
    toast.present();
    toast.onDidDismiss(() => {
      if (onDidDismis) this.events.publish('toast-dismiss');
      else return;
    });
  }

  basicAlert(content: string, title = '', btnText = 'Dismiss', callback?) {
    this.alertCtrl
      .create({
        title: title,
        subTitle: content,
        buttons: [
          {
            text: btnText,
            handler: () => {
              if (callback) callback();
              else return;
            }
          }
        ]
      })
      .present();
  }

  confirmAlert(content: string, title = '', btnTrue = 'Yes', btnFalse = 'No'): Promise<any> {
    return new Promise((resolve, reject) => {
      this.alertCtrl
        .create({
          title: title,
          message: content,
          buttons: [
            {
              text: btnFalse,
              role: 'cancel',
              handler: () => {
                reject(false);
              }
            },
            {
              text: btnTrue,
              handler: () => {
                resolve(true);
              }
            }
          ]
        })
        .present();
    });
  }

  showLoading(content = '', spinner = 'crescent') {
    return this.loadingCtrl.create({
      content: content,
      spinner: spinner
    });
  }

  showModal(component, params: any = '') {
    return this.modalCtrl.create(component, { params });
  }

  showPopover(page, params: any = '', cssClass: string = 'popover-width', backdrop = true, backdropDismiss = true) {
    const style = {
      cssClass: cssClass,
      showBackdrop: backdrop,
      enableBackdropDismiss: backdropDismiss
    };
    return this.popoverCtrl.create(page, { params }, style);
  }
}
