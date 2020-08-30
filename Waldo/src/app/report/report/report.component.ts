import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Store, UserService, MapService } from '../../_services/index'
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  //Will dictate whether the searchbar for store addresses is displayed or the from to be filled out
  canShow: boolean = false;

  //Each of the following variables is associated with a question on the report form
  reqMasks: string;
  masks: string;
  gloves: string;
  sanitizer: string;
  towels: string;
  tp: string;
  liquid: string;
  bar: string;
  wipes: string;
  aero: string;
  bleach: string;
  flush: string;
  tissues: string;
  diapers: string;
  filters: string;
  cold: string;
  cough: string;
  rubAlc: string;
  antiseptic: string;
  thermometer: string;
  firstAid: string;
  bottles: string;
  eggs: string;
  milk: string;
  bread: string;
  beef: string;
  chicken: string;
  pork: string;
  yeast: string;
  date: Date;

  //This store variable is created to be filled when the user enters information about products
  reportStore: Store = {
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    masksRequired: '',
    masks: '',
    gloves: '',
    handSanitizer: '',
    paperTowels: '',
    toiletPaper: '',
    liquidSoap: '',
    barSoap: '',
    cleaningWipes: '',
    aerosolDisinfectant: '',
    bleach: '',
    flushableWipes: '',
    tissues: '',
    diapers: '',
    waterFilters: '',
    coldRemedies: '',
    coughRemedies: '',
    rubbingAlcohol: '',
    antiseptic: '',
    thermometer: '',
    firstAidKit: '',
    waterBottles: '',
    eggs: '',
    milk: '',
    bread: '',
    beef: '',
    chicken: '',
    pork: '',
    yeast: '',
    reportedBy: '',
    timestamp: ''
  }

  /*The subscription variable is necessary to communicate with the user service we created to 
    track if a user is logged in to the app. The loggedIn variable shows whether they are logged in
    and by will be used to retreive their username as it is recorded in our database
  */
  userSubscription: Subscription;
  loggedIn: boolean;
  by: string;

  //The lat and long are used to store the user's current location and results will be filled when the user enters a keyword in the searchbar
  latitude: number;
  longitude: number;
  results: any = [];
  
  //The location chosen by the user to report on and the photo associated with it on Google
  selectedLoc: any;
  linkToPhoto: any;

  /*Establishes access to the router, location services, HTTPCient, alertController, our userService, and the mapService 
    that resets the map when a report is filed. Within the constructor, the rules of the subscription to our userService are set. 
    The userService information varies based on whether a new account is created or an existing account is used, and 
    is parsed accordingly.
  */
  constructor(private route: Router, private geolocation: Geolocation, private http: HttpClient, public alertController: AlertController, 
    private userService: UserService, private mapService: MapService) { 
    this.userSubscription = this.userService.onStatus().subscribe(status => {
      if (status[0] == "account"){
        this.loggedIn = status[1]
        this.by = status[2]
      } else if (status[0] == "registration"){
        this.loggedIn = status[1]
        this.by = status[5]
      } else {
        this.loggedIn = status[0]
      }
    })
  }

  //Initially established whether a user is logged in when the page loads
  ngOnInit() { 
    this.userService.getStatus();
  }

  //Clears any fields the user may have entered and navigates to the map page
  backToMap(): void {
    this.clearFields()
    this.route.navigate(['tabs/tab1'])
  }

  //Takes in what is entered into the search bar, gathers the current location of the user, and 
  //searches for locations near the users location using the keyword(s) entered
  public getResults(ev: any) {
    let val: String = ev.target.value;

    if (val === "") {
      this.canShow = false
    }

    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    });

    this.searchPlaces(this.latitude, this.longitude, val);
  }

  //Using a proxy, we access the Google Maps API to query with the given keyword(s) and current user location.
  //The returned results are then stored in the results field to be presented to the user
  async searchPlaces(lat, long, input) {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    var placesString = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&location=' + lat + ',' + long + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = proxyURL.concat(placesString);
    const data = await this.http.get(httpString, { responseType: 'json' }).toPromise();
    this.results = data['results'];
    return data['results'];
  }

  //When a user selects a result, its address will be displayed, the form will open, and the selected result will be stored
  public showResults(ev: any, item) {
    this.canShow = true;
    this.selectedLoc = item;
  }

  /*Fills in the fields of a store interface with the fields of the selected location and the entered report information. 
    The current date and time are then retrieved, formatted and stored in the timestamp field of the store. This allows user 
    to see the most recent update.
  */
  createStore() {
    this.reportStore['name'] = this.selectedLoc['name']
    this.reportStore['latitude'] = this.selectedLoc['geometry']['location']['lat'].toString()
    this.reportStore['longitude'] = this.selectedLoc['geometry']['location']['lng'].toString()
    this.reportStore['address'] = this.selectedLoc['formatted_address']
    this.reportStore['masksRequired'] = this.reqMasks
    this.reportStore['masks'] = this.masks
    this.reportStore['gloves'] = this.gloves
    this.reportStore['handSanitizer'] = this.sanitizer
    this.reportStore['paperTowels'] = this.towels
    this.reportStore['toiletPaper'] = this.tp
    this.reportStore['liquidSoap'] = this.liquid
    this.reportStore['barSoap'] = this.bar
    this.reportStore['cleaningWipes'] = this.wipes
    this.reportStore['aerosolDisinfectant'] = this.aero
    this.reportStore['bleach'] = this.bleach
    this.reportStore['flushableWipes'] = this.flush
    this.reportStore['tissues'] = this.tissues
    this.reportStore['diapers'] = this.diapers
    this.reportStore['waterFilters'] = this.filters
    this.reportStore['coldRemedies'] = this.cold
    this.reportStore['coughRemedies'] = this.cough
    this.reportStore['rubbingAlcohol'] = this.rubAlc
    this.reportStore['antiseptic'] = this.antiseptic
    this.reportStore['thermometer'] = this.thermometer
    this.reportStore['firstAidKit'] = this.firstAid
    this.reportStore['waterBottles'] = this.bottles
    this.reportStore['eggs'] = this.eggs
    this.reportStore['milk'] = this.milk
    this.reportStore['bread'] = this.bread
    this.reportStore['beef'] = this.beef
    this.reportStore['chicken'] = this.chicken
    this.reportStore['pork'] = this.pork
    this.reportStore['yeast'] = this.yeast
    this.reportStore['reportedBy'] = this.by

    this.date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
    const time = new Intl.DateTimeFormat('en-US', options).format(this.date)
    this.reportStore['timestamp'] = this.date.toDateString() + " " + time
  }

  //All report form entry fields are set to empty
  clearFields() {
    this.reqMasks = '';
    this.masks = '';
    this.gloves = '';
    this.sanitizer = '';
    this.towels = '';
    this.tp = '';
    this.liquid = '';
    this.bar = '';
    this.wipes = '';
    this.aero = '';
    this.bleach = '';
    this.flush = '';
    this.tissues = '';
    this.diapers = '';
    this.filters = '';
    this.cold = '';
    this.cough = '';
    this.rubAlc = '';
    this.antiseptic = '';
    this.thermometer = '';
    this.firstAid = '';
    this.bottles = '';
    this.eggs = '';
    this.milk = '';
    this.bread = '';
    this.beef = '';
    this.chicken = '';
    this.pork = '';
    this.yeast = '';
    this.by = '';
    this.results = '';
  }

  /*Not all fields must be entered by the user, as such we chose to rely on the previously entered report to fill any gaps
    in the entry. For each field of the report about the store, if an option was not chosen or they selected the unsure option,
    the report field is updated to contain the information from the most recent previous report on the location. 
    If there was not a previous report on the location, any fields that are undefined or the user marked as unsure are set to 
    empty strings.
  */
  checkPrevReports(data: Store[]) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]['name'] == this.reportStore['name'] && data[i]['latitude'] == this.reportStore['latitude']
        && data[i]['longitude'] == this.reportStore['longitude'] && data[i]['address'] == this.reportStore['address']) {
        for (var key in this.reportStore) {
          if (this.reportStore[key] == undefined || this.reportStore[key] == "unsure") {
            this.reportStore[key] = data[i][key]
          }
        }
        return
      }
    }
    for (var key in this.reportStore) {
      if (this.reportStore[key] == undefined || this.reportStore[key] == "unsure") {
        this.reportStore[key] = ''
      }
    }
    return
  }

  /*This function files the report in our database. All current reports are pulled, and the final store interface is populated
    with user entered (and possibly previous report information). HTTP headers are then set to post the report to our API. 
    If the post was successful, true is returned, a success alert is triggered, fields are cleared, a message is sent through the 
    mapService triggering a reset to include the new report, and canShow is reset to false. If the post was unsuccessful, false is 
    returned and an error alert is triggered.
  */
  async report() {
    const data: Store[] = await this.http.get<Store[]>('https://waldofind.azurewebsites.net/store').toPromise();

    this.createStore()
    this.checkPrevReports(data)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    const data2 = await this.http.post<boolean>('https://waldofind.azurewebsites.net/store/post', this.reportStore, httpOptions).toPromise();
    if (data2 == true){
      this.success()
      this.clearFields()
      this.mapService.sendStatus(0)
      this.canShow = false
    } else {
      this.errorOccurred()
    }
  }

  //The Success Alert will prompt the user to either enter more reports or return to the map.
  async success() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      subHeader: 'Your Report Has Been Filed',
      message: 'Please select \"<strong>More</strong>\" if you would like to follow another report. ' + 
        'Please select \"<strong>Ok</strong>\" to be taken back to the map.',
      buttons: [
        {
          text: 'More',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm More');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
            this.backToMap();
          }
        }
      ]
    });

    await alert.present();
  }

  //The error alert will prompt the user to to check thier entries and try again. 
  async errorOccurred() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Error Occurred',
      message: 'An error occurred when entering your report, please check you entry and try again.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

}
