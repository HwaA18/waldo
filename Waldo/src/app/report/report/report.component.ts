import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  latitude: number;
  longitude: number;
  results:any = [];
  canShow: boolean = false;
  selectedLoc: any;
  linkToPhoto: any;

  constructor(private route: Router, private geolocation: Geolocation, private http: HttpClient) { }

  ngOnInit() {}

  backToMap(): void {
    this.route.navigate(['tabs/tab1'])
  }

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

}
