import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service';
import { User } from '../../models/user';
import { ApiServiceProvider } from '../../providers/api-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  private id: number = 0;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private api: ApiServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.data = new User();
    this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    this.isSearching = true;
    this.api.get('/users/' + this.id).subscribe(
      sub => {
        this.isSearching = false;
        this.data = sub;
      },
      err => {
        this.isSearching = false;
        this.utility.showToast(err);
      }
    );
  }

  edit() {
    alert('not implemented yet');
  }
}
