import { Component } from '@angular/core';
import { GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from "@ionic-native/google-maps";
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private route: Router, public platform: Platform) { }

  //I only did reroute to tab 3 as a place holder
  nextpage() {
    this.route.navigate(['/tabs/tab2']);
  }

  /* Only instantiate the map AFTER the view is initialized and the DOM is accessible */
	ngAfterViewInit() {
		this.platform.ready().then(() => this.loadMap());
	}


	loadMap() {
		/* The create() function will take the ID of your map element */
		const map = GoogleMaps.create('map');

		map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => {
			const coordinates: LatLng = new LatLng(41, -87);

			map.setCameraTarget(coordinates);
			map.setCameraZoom(8);
		});
	}

}
