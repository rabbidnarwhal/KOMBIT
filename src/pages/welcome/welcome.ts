import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { trigger, transition, style, animate } from '@angular/animations';

@IonicPage()
@Component({
  selector: 'page-welcome',
  animations: [
    trigger('btnAnimation', [
      transition(':enter', [ style({ opacity: 0 }), animate('500ms', style({ opacity: 1 })) ]),
      transition(':leave', [ style({ opacity: 1 }), animate('500ms', style({ opacity: 0 })) ])
    ])
  ],
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;
  slidesContent: any;
  public buttonShow: boolean = false;
  constructor(private navCtrl: NavController) {
    this.slidesContent = [
      { title: 'Welcome', image: 'assets/imgs/combit-welcome.jpg' },
      { title: 'Search Solution', image: 'assets/imgs/combit-solution.jpg' },
      { title: 'Synergize', image: 'assets/imgs/combit-synergize.jpg' }
    ];
  }

  ionViewDidLoad() {
    this.slides.lockSwipeToPrev(true);
  }

  nextPage() {
    this.navCtrl.setRoot('LoginPage');
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
