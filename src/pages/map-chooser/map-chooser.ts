import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { google } from 'google-maps';
import {
  Geocoder,
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  LocationService,
  MyLocationOptions,
  LatLng,
  LatLngBounds
} from '@ionic-native/google-maps';
import { Config } from '../../config/config';
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
  private zoom: number;
  private position: LatLng;
  private currentPosition: LatLng;
  private autocompleteService: any;
  private placesService: any;
  private coordinate: string;
  private apiKey: string;

  public locationName: string;
  public savedLocation: string;
  public mode: string;
  public places: any;
  public mapIsLoaded: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utility: UtilityServiceProvider,
    private events: Events,
    private zone: NgZone,
    private element: ElementRef
  ) {
    this.position = new LatLng(-8.636012911829676, 115.21293640136719);
    this.zoom = 8;
    this.apiKey = Config.GOOGLE_MAP_API_KEY;
    this.mode = this.navParams.data.type || 'choose';
  }

  ionViewDidLoad() {
    if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
      window['mapInit'] = () => {
        this.initMap();
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
      this.initMap();
    }
  }

  private initMap() {
    new Promise(resolve => {
      if (this.navParams.data.coordinate && this.mode === 'show') {
        this.position = new LatLng(+this.navParams.data.coordinate.split(', ')[0], +this.navParams.data.coordinate.split(', ')[1]);
        this.zoom = 16;
        resolve();
      } else {
        this.getPosition()
          .then(pos => {
            this.zoom = 16;
            if (this.navParams.data.coordinate && this.mode === 'direction') {
              this.position = new LatLng(+this.navParams.data.coordinate.split(', ')[0], +this.navParams.data.coordinate.split(', ')[1]);
              this.currentPosition = pos.latLng;
            } else this.position = pos.latLng;
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
          target: this.position,
          zoom: this.zoom
        }
      };
      this.maps = GoogleMaps.create(element, mapOptions);
      this.maps
        .one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          this.mapIsLoaded = true;
          if (this.mode === 'direction') {
            this.addMarker(this.currentPosition, '', false);
            const directionsService = new google.maps.DirectionsService();
            const directionRequest = {
              origin: this.currentPosition,
              destination: this.position,
              travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(directionRequest, (response, status) => {
              if (status === google.maps.DirectionsStatus.OK && response.routes.length) {
                const directionPath = [];
                const latLngBounds: LatLng = new LatLngBounds([this.currentPosition, this.position]).getCenter();
                response.routes[0].overview_path.forEach(element => {
                  const pos: LatLng = new LatLng(element.lat(), element.lng());
                  directionPath.push(pos);
                });
                this.maps.addPolyline({ points: directionPath, width: 5, geodesic: true });
                this.maps.moveCamera({ target: latLngBounds });
              }
            });
          }
          this.addMarker(this.position, this.mode === 'choose' ? 'Choose this location' : '');
          return;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  private addMarker(latLng: LatLng, title, centerCamera: boolean = true) {
    if (!window['cordova']) return;

    this.maps
      .addMarker({
        title: title,
        icon: 'orange',
        animation: 'DROP',
        position: latLng
      })
      .then(marker => {
        Promise.resolve()
          .then(() => {
            if (centerCamera) {
              return this.maps.moveCamera({
                target: latLng,
                zoom: this.zoom
              });
            } else return Promise.resolve();
          })
          .then(() => this.getLocationName(latLng))
          .then(res => {
            if (this.mode === 'choose') {
              this.locationName = res;
              marker.showInfoWindow();
            } else marker.setTitle(res);
          })
          .catch(err => this.utility.showToast(err));

        if (this.mode === 'choose') {
          this.autocompleteService = new google.maps.places.AutocompleteService();
          this.placesService = new google.maps.places.PlacesService(this.mapElement.nativeElement);

          this.maps.on(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(() => {
            this.zone.run(() => (this.locationName = 'Please wait...'));
          });

          this.maps.on(GoogleMapsEvent.CAMERA_MOVE).subscribe(res => {
            marker.setPosition(res[0].target);
          });

          this.maps.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(res => {
            marker.setPosition(res[0].target);
            marker.showInfoWindow();
            this.coordinate = res[0].target.lat + ', ' + res[0].target.lng;
            this.getLocationName(res[0].target)
              .then(res => this.zone.run(() => (this.locationName = res)))
              .catch(err => this.utility.showToast(err));
          });

          const locationEvent = () => {
            const location = {
              address: this.locationName,
              coordinate: this.coordinate
            };
            this.events.publish('location', location);
            this.navCtrl.pop();
          };

          marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => locationEvent());

          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => locationEvent());

          // let nativeHomeInputBox = document.getElementById('location').getElementsByTagName('input')[0];
          // let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
          //   types: ['address']
          // });
          // autocomplete.addListener('place_changed', () => {
          //   this.zone.run(() => {
          //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //     if (place.geometry === undefined || place.geometry === null) {
          //       return;
          //     }
          //     marker.setPosition({
          //       lat: place.geometry.location.lat(),
          //       lng: place.geometry.location.lng()
          //     });
          //     marker.showInfoWindow();
          //     this.maps.moveCamera({
          //       lat: place.geometry.location.lat(),
          //       lng: place.geometry.location.lng()
          //     });
          //     this.coordinate = place.geometry.location.lat() + ', ' + place.geometry.location.lng();
          //   });
          // });
        } else marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => marker.showInfoWindow());
      })
      .catch(err => this.utility.showToast(err));
  }

  private getLocationName(latLng: LatLng): Promise<string> {
    return new Promise((resolve, reject) => {
      Geocoder.geocode({ position: latLng })
        .then(res => resolve(res[0].extra.lines[0]))
        .catch(err => reject(err));
    });
  }

  searchLocation() {
    if (this.locationName.length > 0) {
      let config = {
        types: ['address'],
        input: this.locationName,
        componentRestrictions: { country: 'id' }
      };
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.places = [];
          predictions.forEach(prediction => {
            this.places.push(prediction);
          });
        }
      });
    } else this.places = [];
  }

  selectPlace(place) {
    this.places = [];
    this.placesService.getDetails({ placeId: place.place_id }, details => {
      this.zone.run(() => {
        this.coordinate = details.geometry.location.lat() + ', ' + details.geometry.location.lng();
        this.maps.moveCamera({
          target: new LatLng(details.geometry.location.lat(), details.geometry.location.lng())
        });
      });
    });
  }

  clearInput() {
    this.savedLocation = this.locationName;
    this.locationName = '';
  }

  adjustTextareaHeight() {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.height = '16px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
