import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';


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

  public showResults(ev: any, item) {
    this.canShow = true;
    this.selectedLoc = item;

    this.getPhoto();
  }

  public getPhoto() {
    var placesString = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + this.selectedLoc['photos'][0]['photo_reference'] + '&key=AIzaSyDN6CczC9Jy5lKDlw8ET2Z_cpjbLjTf5k8';
    let httpString = placesString //proxyURL.concat(placesString); 
    console.log(httpString);
    this.linkToPhoto = httpString;

    return httpString;
  }
}
