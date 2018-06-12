import { NgModule } from '@angular/core';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPageModule } from 'ionic-angular';
import { MapChooserPage } from './map-chooser';

@NgModule({
  declarations: [MapChooserPage],
  imports: [IonicPageModule.forChild(MapChooserPage)],
  providers: [GoogleMaps, Geolocation]
})
export class MapChooserPageModule {}
