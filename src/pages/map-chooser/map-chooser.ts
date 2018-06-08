import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import {
  Geocoder,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  LocationService,
  MyLocationOptions
} from '@ionic-native/google-maps';
/**
 * Generated class for the MapChooserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'map-location'
})
@Component({
  selector: 'page-map-chooser',
  templateUrl: 'map-chooser.html'
})
export class MapChooserPage {
  @ViewChild('map') mapElement: ElementRef;
  private maps: GoogleMap;
  private position: any;
  public locationName: string;
  private coordinate: string;
  public mode: string;
  public mapIsLoaded: boolean = false;
  private zone: NgZone;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private utility: UtilityServiceProvider,
    private events: Events,
    private element: ElementRef
  ) {
    this.position = {
      lat: -8.636012911829676,
      lng: 115.21293640136719,
      zoom: 8
    };
    this.mode = this.navParams.data.type;
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ionViewDidLoad() {
    new Promise(resolve => {
      if (this.navParams.data.coordinate) {
        this.position.lat = this.navParams.data.coordinate.split(', ')[0];
        this.position.lng = this.navParams.data.coordinate.split(', ')[1];
        this.position.zoom = 14;
        resolve();
      } else {
        this.getPosition()
          .then(pos => {
            this.position.lat = pos.latLng.lat;
            this.position.lng = pos.latLng.lng;
            this.position.zoom = 14;
            resolve();
          })
          .catch(err => {
            this.utility.showToast('Unable to get location');
            resolve();
          });
      }
    }).then(() => {
      this.loadMap();
    });
  }

  private getPosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    return LocationService.getMyLocation(options);
  }

  private loadMap() {
    const element = this.mapElement.nativeElement;
    if (!window['cordova']) {
      let alertCallback = () => this.navCtrl.pop();
      this.utility.basicAlert('Map only available in cordova', '', 'Ok', alertCallback);
    } else {
      const mapOptions: GoogleMapOptions = {
        controls: {
          myLocation: true,
          myLocationButton: true
        },
        camera: {
          target: {
            lat: this.position.lat,
            lng: this.position.lng
          },
          zoom: this.position.zoom
        }
      };
      this.maps = GoogleMaps.create(element, mapOptions);
      this.maps.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.mapIsLoaded = true;
        this.addMarker(this.position.lat, this.position.lng, this.mode === 'choose' ? 'Choose this location' : '');
        return;
      });
    }
  }

  private addMarker(lat, long, title) {
    if (!window['cordova']) return;
    this.maps
      .addMarker({
        title: title,
        icon: 'orange',
        animation: 'DROP',
        position: {
          lat: lat,
          lng: long
        }
      })
      .then(marker => {
        this.maps
          .moveCamera({
            target: {
              lat: lat,
              lng: long
            },
            zoom: 14
          })
          .then(() => this.getLocationName(lat, long))
          .then(res => {
            if (this.mode === 'choose') this.locationName = res;
            else marker.setTitle(res);
            marker.showInfoWindow();
          })
          .catch(err => this.utility.showToast(err));

        if (this.mode === 'choose') {
          this.maps.on(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(res => {
            this.zone.run(() => {
              this.locationName = 'Please wait...';
            });
          });

          this.maps.on(GoogleMapsEvent.CAMERA_MOVE).subscribe(res => {
            marker.setPosition({
              lat: res[0].target.lat,
              lng: res[0].target.lng
            });
          });

          this.maps.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(res => {
            marker.setPosition({
              lat: res[0].target.lat,
              lng: res[0].target.lng
            });
            marker.showInfoWindow();
            this.coordinate = res[0].target.lat + ', ' + res[0].target.lng;
            this.getLocationName(res[0].target.lat, res[0].target.lng)
              .then(res => {
                this.zone.run(() => {
                  this.locationName = res;
                });
              })
              .catch(err => this.utility.showToast(err));
          });

          marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
            const location = { address: this.locationName, coordinate: this.coordinate };
            this.events.publish('location', location);
            this.navCtrl.pop();
          });

          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            const location = { address: this.locationName, coordinate: this.coordinate };
            this.events.publish('location', location);
            this.navCtrl.pop();
          });
        } else {
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            marker.showInfoWindow();
          });
        }
      })
      .catch(err => this.utility.showToast(err));
  }

  private getLocationName(lat, long): Promise<string> {
    return new Promise((resolve, reject) => {
      Geocoder.geocode({
        position: {
          lat: lat,
          lng: long
        }
      })
        .then(res => {
          resolve(res[0].extra.lines[0]);
        })
        .catch(err => reject(err));
    });
  }

  private adjustTextareaHeight() {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.height = '16px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
