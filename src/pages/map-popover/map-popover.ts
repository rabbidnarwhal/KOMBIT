import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Config } from '../../config/config';
import { LatLng, LocationService, MyLocationOptions } from '@ionic-native/google-maps';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { google } from 'google-maps';

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
  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private infowindow: google.maps.InfoWindow;
  private apiKey: string;

  private zoom: number;
  private autocompleteService: any;
  private placesService: any;
  private coordinate: string;

  public locationName: string = 'Please wait...';
  public savedLocation: string;
  public mode: string;
  public places: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public utility: UtilityServiceProvider,
    public zone: NgZone,
    private element: ElementRef,
    private events: Events
  ) {
    this.apiKey = Config.GOOGLE_MAP_API_KEY;
    this.zoom = 16;
  }

  ionViewDidLoad(): void {
    this.loadGoogleMaps();
  }

  private loadGoogleMaps() {
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
    new Promise((resolve, reject) => {
      if (this.navParams.data.coordinate) {
        this.position = new LatLng(
          +this.navParams.data.coordinate.split(', ')[0],
          +this.navParams.data.coordinate.split(', ')[1]
        );
        resolve();
      } else {
        this.getPosition()
          .then((pos) => {
            this.position = pos.latLng;
            resolve();
          })
          .catch((err) => {
            this.utility.showToast('Unable to get location due to: ' + err.toString());
            this.position = new LatLng(-8.636012911829676, 115.21293640136719);
            this.zoom = 8;
            resolve();
          });
      }
    })
      .then(() => {
        this.coordinate = this.position.lat + ', ' + this.position.lng;
        this.loadMap();
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
  }

  private loadMap() {
    let mapOptions: google.maps.MapOptions = {
      center: this.position,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: this.zoom,
      fullscreenControl: false,
      // gestureHandling: 'none',
      keyboardShortcuts: false,
      mapTypeControl: false,
      noClear: false,
      overviewMapControl: false,
      panControl: false,
      rotateControl: false,
      scaleControl: false,
      scrollwheel: false,
      signInControl: false,
      streetViewControl: false,
      zoomControl: false
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({ position: this.position, map: this.map, title: 'Choose this location' });
    this.infowindow = new google.maps.InfoWindow({
      content: 'Choose this location'
    });
    this.infowindow.open(this.map, this.marker);

    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(this.map);

    this.getLocationName(this.position).then((res) => {
      this.zone.run(() => (this.locationName = res));
    });

    this.map.addListener('dragstart', () => {
      this.zone.run(() => (this.locationName = 'Please wait...'));
    });

    this.map.addListener('drag', () => {
      this.marker.setPosition(new LatLng(this.map.getCenter().lat(), this.map.getCenter().lng()));
    });

    this.map.addListener('dragend', () => {
      const latLng = new LatLng(this.map.getCenter().lat(), this.map.getCenter().lng());
      this.marker.setPosition(latLng);
      this.coordinate = this.map.getCenter().lat() + ', ' + this.map.getCenter().lng();
      this.getLocationName(latLng)
        .then((res) => this.zone.run(() => (this.locationName = res)))
        .catch((err) => this.utility.showToast(err));
    });

    const locationEvent = () => {
      const location = {
        address: this.locationName,
        coordinate: this.coordinate
      };
      this.events.publish('location-appointment', location);
      this.navCtrl.pop();
    };

    this.marker.addListener('click', () => {
      locationEvent();
    });
    this.infowindow.addListener('click', () => {
      locationEvent();
    });
  }

  private getPosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    return LocationService.getMyLocation(options);
  }

  private getLocationName(latLng: LatLng): Promise<string> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (result, status) => {
        if (status.toString() === 'OK') {
          resolve(result[0].formatted_address);
        } else {
          reject('Geocoder Failed due to: ' + status);
        }
      });
    });
  }

  searchLocation() {
    if (this.locationName.length > 1) {
      let config = {
        types: [ 'establishment' ],
        input: this.locationName,
        componentRestrictions: { country: 'id' }
      };
      this.autocompleteService.getPlacePredictions(config, (predictionsPlace, statusPlace) => {
        config.types = [ 'address' ];
        if (statusPlace === google.maps.places.PlacesServiceStatus.OK && predictionsPlace) {
          this.places = [];
          predictionsPlace.forEach((prediction) => {
            this.places.push(prediction);
          });
        }
        this.autocompleteService.getPlacePredictions(config, (predictionsAddress, statusAddress) => {
          if (statusAddress === google.maps.places.PlacesServiceStatus.OK && predictionsAddress) {
            predictionsAddress.forEach((prediction) => {
              this.places.push(prediction);
            });
          }
        });
      });
    } else this.places = [];
  }

  selectPlace(place) {
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.places = [];
      this.zone.run(() => {
        this.locationName = details.formatted_address;
        this.coordinate = details.geometry.location.lat() + ', ' + details.geometry.location.lng();
        this.map.setCenter(new LatLng(details.geometry.location.lat(), details.geometry.location.lng()));
        this.marker.setPosition(details.geometry.location);
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
