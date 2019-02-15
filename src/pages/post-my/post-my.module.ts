import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostMyPage } from './post-my';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [ PostMyPage ],
  imports: [ IonicPageModule.forChild(PostMyPage), FooterMenuModule, IonicImageLoader ],
  providers: [ DataProductServiceProvider ]
})
export class PostMyPageModule {}
