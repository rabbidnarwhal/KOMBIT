import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Config } from '../../config/config';
import { LatLng, LocationService, MyLocationOptions, LatLngBounds } from '@ionic-native/google-maps';
import { UtilityServiceProvider } from '../../providers/utility-service';

declare var google;

@IonicPage({
  name: 'map-popover'
})
@Component({
  selector: 'page-map-popover',
  templateUrl: 'map-popover.html'
})
export class MapPopoverPage {
  @ViewChild('map') mapElement: ElementRef;

  private position: LatLng;
  private currentPosition: LatLng;
  private map: google.maps.Map;
  private apiKey: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public utility: UtilityServiceProvider,
    public zone: NgZone
  ) {
    this.apiKey = Config.GOOGLE_MAP_API_KEY;
  }

  ionViewDidLoad(): void {
    this.loadGoogleMaps().then(() => {
      // this.addMarker(this.currentPosition, 'Destination');
      // this.addMarker(this.position, 'Origin');
      this.createDirection();
    });
  }

  private loadGoogleMaps(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
        window['mapInit'] = () => {
          this.initMap().then(() => {
            resolve(true);
          });
        };

        let script = document.createElement('script');
        script.id = 'googleMaps';

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);
      } else {
        this.initMap().then(() => {
          resolve(true);
        });
      }
    });
  }

  private initMap(): Promise<any> {
    return new Promise((resolve) => {
      this.getPosition()
        .then((pos) => {
          this.position = new LatLng(
            +this.navParams.data.coordinate.split(', ')[0],
            +this.navParams.data.coordinate.split(', ')[1]
          );
          this.currentPosition = pos.latLng;
          const latLng = new LatLngBounds([ this.currentPosition, this.position ]).getCenter();
          let mapOptions = {
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          resolve();
        })
        .catch((err) => {
          this.utility.showToast('Unable to get location');
          resolve();
        });
    });
  }

  private getPosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    return LocationService.getMyLocation(options);
  }

  private createDirection() {
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const directionRequest = {
      origin: this.currentPosition,
      destination: this.position,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsDisplay.setMap(this.map);
    directionsService.route(directionRequest, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }
}
