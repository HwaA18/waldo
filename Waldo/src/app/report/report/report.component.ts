import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Store, UserService } from '../../_services/index'
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  latitude: number;
  longitude: number;
  results: any = [];
  canShow: boolean = false;
  selectedLoc: any;
  linkToPhoto: any;

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
  by: string;

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
    reportedBy: ''
  }

  userSubscription: Subscription;
  loggedIn: boolean;

  constructor(private route: Router, private geolocation: Geolocation, private http: HttpClient, public alertController: AlertController, private userService: UserService) { 
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

  ngOnInit() { 
    this.userService.getStatus();
  }

  backToMap(): void {
    this.clearFields()
    this.route.navigate(['tabs/tab1'])
  }

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
    console.log(this.results);
    //return this.results;

  }

  async searchPlaces(lat, long, input) {
    //const data = await this.http.get('https://localhost:5001/user/', {responseType: 'json'}).toPromise();
    //console.log(data[0]['username'])
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    var placesString = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&location=' + lat + ',' + long + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = proxyURL.concat(placesString);
    console.log(httpString);
    const data = await this.http.get(httpString, { responseType: 'json' }).toPromise();
    //console.log(data['results'][0]['formatted_address']);
    this.results = data['results'];
    return data['results'];
  }

  public showResults(ev: any, item) {
    this.canShow = true;
    this.selectedLoc = item;
  }

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
  }

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

  async report() {
    console.log("Masks Required: " + this.reqMasks)
    console.log("Masks: " + this.masks)
    console.log("Yeast: " + this.yeast)
    const data: Store[] = await this.http.get<Store[]>('https://waldofind.azurewebsites.net/store').toPromise();
    console.log(data)

    this.createStore()
    this.checkPrevReports(data)
    console.log(this.reportStore)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    const data2 = await this.http.post<boolean>('https://waldofind.azurewebsites.net/store/post', this.reportStore, httpOptions).toPromise();
    console.log(data2)
    if (data2 == true){
      this.success()
      this.clearFields()
      this.canShow = false
    } else {
      this.errorOccurred()
    }
  }

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
            console.log('Confirm Cancel');
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
