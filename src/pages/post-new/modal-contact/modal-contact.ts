import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/rx';

@IonicPage()
@Component({
  selector: 'page-modal-contact',
  templateUrl: 'modal-contact.html'
})
export class ModalContactPage {
  optionSubject: BehaviorSubject<number>;
  contactTypeList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.contactTypeList = [
      { id: 1, title: 'Add me as Product Owner', image: 'assets/imgs/product-contact.png' },
      { id: 2, title: 'Select from Contact List', image: 'assets/imgs/product-contact-book.png' },
      { id: 3, title: 'Add Manually', image: 'assets/imgs/product-contact-edit.png' }
    ];
  }

  ionViewDidLoad() {
    if (this.navParams.data) {
      this.optionSubject = this.navParams.data.params.optionSubject;
      this.contactTypeList[0]['subtitle'] = `${this.navParams.data.params.contact.name} ${this.navParams.data.params
        .contact.phone}`;
    }
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  selectContactType(type) {
    this.optionSubject.next(type);
    this.dismissModal();
  }
}
