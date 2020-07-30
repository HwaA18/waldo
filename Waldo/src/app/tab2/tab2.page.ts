import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Store } from '../_services/index';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private http: HttpClient, private geolocation: Geolocation) {}

  latitude: number;
  longitude: number;
  results:any = [];
  canShow: boolean = false;
  selectedLoc: any;
  linkToPhoto: any;

  blank: Store = {
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

  storeInfo: Store = this.blank;

  public getResults(ev: any) {
    let val: String = ev.target.value;

    if(val === "") {
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
    var placesString = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input +'&location=' + lat +',' + long + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = proxyURL.concat(placesString);
    console.log(httpString);
    const data = await this.http.get(httpString, {responseType: 'json'}).toPromise();
    //console.log(data['results'][0]['formatted_address']);
    this.results = data['results'];
    return data['results'];
  }

  locateReport(data: Store[]){
    for (let i = 0; i < data.length; i++) {
      if (data[i]['name'] == this.selectedLoc['name'] && data[i]['latitude'] == this.selectedLoc['geometry']['location']['lat'].toString()
        && data[i]['longitude'] == this.selectedLoc['geometry']['location']['lng'].toString() && data[i]['address'] == this.selectedLoc['formatted_address']) {
        this.storeInfo = data[i]
        return
      }
    }
    this.storeInfo = this.blank
  }

  public async showResults(ev: any, item) {
    this.canShow = true;
    this.selectedLoc = item;

    this.getPhoto();
    // this.info = 'Please confirm that you supplied the correct information, or click \"<strong>Cancel</strong>\" to continue editing.' + 
    //     '<br><br><strong>First Name:</strong> ' + this.selectedLoc['name'] + '<br><strong>Last Name:</strong> ' + this.selectedLoc['name'] + 
    //     '<br><strong>Userame:</strong> ' + this.selectedLoc['name'] + '<br><strong>Address:</strong> ' + this.selectedLoc['formatted_address']
    const data: Store[] = await this.http.get<Store[]>('https://waldofind.azurewebsites.net/store').toPromise();
    console.log(data)
    this.locateReport(data)
  }

  public getPhoto() {
    var placesString = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + this.selectedLoc['photos'][0]['photo_reference'] + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = placesString //proxyURL.concat(placesString); 
    console.log(httpString);
    this.linkToPhoto = httpString;

    return httpString;
  }
}
