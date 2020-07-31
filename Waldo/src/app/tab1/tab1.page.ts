import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService, Store, Loc, MapService } from '../_services/index';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;

  newLocations: any[] = [];
  locationsStocks: Store[] = [];

  userSubscription: Subscription;
  mapSubscription: Subscription;
  loggedIn: boolean;
  username: string;

  titles: Store = {
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    masksRequired: '',
    masks: 'Masks',
    gloves: 'Gloves',
    handSanitizer: 'Hand Sanitizer',
    paperTowels: 'Paper Towels',
    toiletPaper: 'Toilet Paper',
    liquidSoap: 'Liquid Soap',
    barSoap: 'Bar Soap',
    cleaningWipes: 'Cleaning Wipes',
    aerosolDisinfectant: 'Aerosol Disinfectants',
    bleach: 'Bleach',
    flushableWipes: 'Flushable Wipes',
    tissues: 'Tissues',
    diapers: 'Diapers',
    waterFilters: 'Water Filters',
    coldRemedies: 'Cold Remedies',
    coughRemedies: 'Cough Remedies',
    rubbingAlcohol: 'Rubbing Alcohol',
    antiseptic: 'Antiseptic',
    thermometer: 'Thermometer',
    firstAidKit: 'First Aid Kits',
    waterBottles: 'Water Bottles',
    eggs: 'Eggs',
    milk: 'Milk',
    bread: 'Bread',
    beef: 'Beef',
    chicken: 'Chicken',
    pork: 'Pork',
    yeast: 'Yeast',
    reportedBy: '',
    timestamp: '',
  }

  constructor(private route: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private userService: UserService,
    private mapService: MapService,
    private alertController: AlertController,
    private http: HttpClient) {
    this.userSubscription = this.userService.onStatus().subscribe(status => {
      if (status[0] == "account") {
        this.loggedIn = status[1]
        this.username = status[2]
      } else if (status[0] == "registration") {
        this.loggedIn = status[1]
        this.username = status[5]
      } else {
        this.loggedIn = status[0]
      }
    })
    this.mapSubscription = this.mapService.onStatus().subscribe(status => {
      this.loadMap()
    })
  }

  //I only did reroute to tab 3 as a place holder
  //do you mean tab 2 lol
  nextpage() {
    if (this.loggedIn == true) {
      this.route.navigate(['report']);
    } else {
      this.needLogin()
    }
  }

  /* Only instantiate the map AFTER the view is initialized and the DOM is accessible */
  ngOnInit() {
    this.userService.getStatus();
    this.loadMap();
  }

  async setupLocations() {
    const data: Store[] = await this.http.get<Store[]>('https://waldofind.azurewebsites.net/store').toPromise();
    console.log(data)
    this.locationsStocks = data;
    for (let i = 0; i < data.length; i++) {
      this.newLocations[i] = [data[i]['name'], Number(data[i]['latitude']), Number(data[i]['longitude']), (i + 1)]
    }
    console.log(this.newLocations)
  }

  async loadMap() {
    this.geolocation.getCurrentPosition().then(async (resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      await this.setupLocations();
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      // var locations = [
      //   ["Your Location", this.latitude, this.longitude, 3],
      //   ["Wegmans", 39.875973, -75.5408616, 2],
      //   ["Costco", 39.8897425, -75.535326, 1]
      // ];
      var locations = this.newLocations;

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: this.map,
        });

        var out: string = ""
        for (var key in this.locationsStocks[i]) {
          if (this.locationsStocks[i][key] == "Currently Out of Stock" || this.locationsStocks[i][key] == "Not Sold At This Location") {
            if (out == "") {
              out = this.titles[key]
            } else {
              out = out + ", " + this.titles[key]
            }
          }
        }
        out = out + '<br>As Of: ' + this.locationsStocks[i]['timestamp']
        console.log(out)

        //var contentString = '<div style="color: #000; font-weight: bold;">' + locations[i][0] + '</div>';

        google.maps.event.addListener(marker, 'click', (function (marker, i, out) {
          return function () {
            var contentString = '<div style="color: #000; font-weight: bold;">' + locations[i][0] + '<br>Out of: ' + out + '</div>';
            infowindow.setContent(contentString);
            infowindow.open(this.map, marker);
          }
        })(marker, i, out));
      }

      /*this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      }); */

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }

  async needLogin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Must be Logged In',
      message: 'In order to file a report, you must log in to our system.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Log In',
          handler: () => {
            console.log('Confirm Ok');
            this.route.navigate(['tabs/tab3'])
          }
        }
      ]
    });

    await alert.present();
  }


}
