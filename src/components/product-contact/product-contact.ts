import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { ProductDetail } from '../../models/products';
import { CallNumber } from '@ionic-native/call-number';
import { Events, ActionSheetController, NavController } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { UserChatInfo } from '../../models/user';

@Component({
  selector: 'product-contact',
  templateUrl: 'product-contact.html'
})
export class ProductContactComponent {
  @Input() data: ProductDetail;
  @Input() page: string;
  @Input() addressMap: string;

  @Output() makeAppointment = new EventEmitter();
  constructor(
    private navCtrl: NavController,
    private dataProduct: DataProductServiceProvider,
    private callNumber: CallNumber,
    private actionCtrl: ActionSheetController,
    private event: Events,
    private utility: UtilityServiceProvider
  ) {}

  openWhatsapp() {
    const phone = this.data.contactHandphone.replace(/ |-|\+/g, '');
    this.dataProduct
      .addChatProduct(this.data.id)
      .then(() => {
        this.data.interaction.totalChat++;
        if (this.page === 'home') this.event.publish('homeInteraction', { id: this.data.id, type: 'call' });
        else this.event.publish('postInteraction', { id: this.data.id, type: 'call' });
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
    window.open('https://api.whatsapp.com/send?phone=' + phone);
  }

  makePhoneCall() {
    this.dataProduct
      .addChatProduct(this.data.id)
      .then(() => {
        this.data.interaction.totalChat++;
        if (this.page === 'home') this.event.publish('homeInteraction', { id: this.data.id, type: 'call' });
        else this.event.publish('postInteraction', { id: this.data.id, type: 'call' });
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
    this.callNumber
      .callNumber(this.data.contactHandphone, true)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  openCallChooser() {
    this.actionCtrl
      .create({
        title: 'Choose:',
        buttons: [
          {
            text: 'Phone call',
            handler: () => {
              this.makePhoneCall();
            }
          },
          {
            text: 'Whatsapp',
            handler: () => {
              this.openWhatsapp();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .present();
  }

  openMap() {
    location.href =
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' +
      this.data.contact.addressKoordinat.replace(' ', '');

    // use below code if not going to open map to external app/browser
    // this.navCtrl.push('map-popover', { coordinate: this.data.contact.addressKoordinat });
  }

  makeAppointmentClicked() {
    this.makeAppointment.emit('appointment');
  }

  openChatPage() {
    const senderId = this.dataProduct.getUserId();
    const receiverId = this.data.contact.id;
    const receiver: UserChatInfo = {
      id: receiverId,
      image: this.data.contact.image,
      name: this.data.contact.name
    };
    let roomId = '';
    if (senderId > receiverId) {
      roomId = btoa('room_' + receiverId + '_' + senderId);
    } else {
      roomId = btoa('room_' + senderId + '_' + receiverId);
    }
    this.navCtrl.push('ChatRoomPage', { roomId: roomId, receiver: receiver });
  }
}
