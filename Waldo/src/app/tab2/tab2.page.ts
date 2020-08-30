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

  //For the users current coordinates
  latitude: number;
  longitude: number;

  //The results of the user's search when sent to the Google Maps API
  results:any = [];

  //This variable is toggled when results are selected, and will determine if result information is displayed
  canShow: boolean = false;

  //The location the user chooses to investigate and the link to the photo associated with it on Google
  selectedLoc: any;
  linkToPhoto: any;

  //A blank Store to be used as a placeholder
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
    reportedBy: '',
    timestamp: ''
  }

  //this variable is used to get product availabilities for the selected store, originally set to blank
  storeInfo: Store = this.blank;

  //Sets up the second tab to use HTTPClient and Geolocation for the Google Maps elements
  constructor(private http: HttpClient, private geolocation: Geolocation) {}

  //This function gathers the results of the search users completed from the Google Maps API
  //Will get the users current lat and long, and then search using the entered keywords and coordinates
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
  }

  //Using a proxy, we assemble a query with the user's lat, long, and search to get locations from the Google Maps API and fill the results array
  async searchPlaces(lat, long, input) {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    var placesString = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input +'&location=' + lat +',' + long + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = proxyURL.concat(placesString);
    const data = await this.http.get(httpString, {responseType: 'json'}).toPromise();
    this.results = data['results'];
    return data['results'];
  }

  /*When the user selects a location, this is triggered showing information about the selected location. 
    The show results variable is set to true, the selected location is stored, the location's Google Photo is obtained,
    and the current reports we have stored in our database are pulled to search for any information on the selected location.
  */ 
  public async showResults(ev: any, item) {
    this.canShow = true;
    this.selectedLoc = item;

    this.getPhoto();
    const data: Store[] = await this.http.get<Store[]>('https://waldofind.azurewebsites.net/store').toPromise();
    this.locateReport(data)
  }

  //We assemble a query to the Google Maps API to get the photo associated with the location on Google
  public getPhoto() {
    var placesString = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + this.selectedLoc['photos'][0]['photo_reference'] + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = placesString; 
    this.linkToPhoto = httpString;

    return httpString;
  }

  //Searches through the reports in our database to determine if one has been filed for the selected location
  //If we have a matching Store on file it will be populated in storeInfo or storeInfo will be blank
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
}
