import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
// import { BrowserModule } from '@angular/platform-browser';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate, state } from '@angular/animations';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'welcome'
})
@Component({
  selector: 'page-welcome',
  animations: [
    trigger('btnAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('500ms', style({ opacity: 0 }))])
    ])
  ],
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;
  public buttonShow: boolean = false;
  constructor(private navCtrl: NavController) {}

  ionViewDidLoad() {
    this.slides.lockSwipeToPrev(true);
  }

  nextPage() {
    this.navCtrl.setRoot('login');
  }

  checkSlideIndex() {
    this.buttonShow = this.slides.isEnd();
    if (this.slides.isEnd()) {
      this.slides.lockSwipeToNext(true);
    } else {
      this.slides.lockSwipeToNext(false);
    }
    if (this.slides.isBeginning()) {
      this.slides.lockSwipeToPrev(true);
    } else {
      this.slides.lockSwipeToPrev(false);
    }
  }
}
