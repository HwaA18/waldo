import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../_services/index';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page implements OnInit {
  submitted: string = 'Your Form Has Been Submitted'
  firstName: string = 'Starter First Name'
  lastName: string = 'Starter Last Name'
  loggedIn: boolean; 
  username: string = ''
  password: string = ''
  check: any[];

  api: any;

  subscription: Subscription;

  constructor(private userService: UserService, public alertController: AlertController, private http: HttpClient) {
    this.subscription = this.userService.onStatus().subscribe(status => {
      if (status[0] == "account"){
        this.loggedIn = status[1]
      } else if (status[0] == "registration"){
        this.loggedIn = status[1]
        this.firstName = status[2]
        this.lastName = status[3]
      } else {
        this.loggedIn = status[0]
      }
    })
  }

//This is an alert box for when someone doesn't fill out the correct fields.
  async presentMultipleAlertButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Missing Fields',
      message: 'Username and Password are mandatory fields.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  processForm(): void {
    console.log(this.submitted)
    console.log(this.firstName + " " + this.lastName)
    if (this.firstName && this.lastName){
      this.logIn()
    } else {
      this.presentMultipleAlertButtons()
    }
  }

  logIn(): void {
    console.log("Recorded from Login:")
    console.log(this.username + " " + this.password)
    //Still experimenting with how to display the info that comes back from the server
    this.api = this.http.get('https://localhost:5001/user/4')
    console.log('From api: ' + this.api)
    if (this.username && this.password){
      this.userService.sendStatus(["account", true]);
    } else {
      this.presentMultipleAlertButtons()
    }
  }

  logOut(): void {
    this.username = ''
    this.password = ''
    this.userService.sendStatus(["account", false]);
  }

  ngOnInit() : void {
    this.userService.getStatus();
    console.log(this.loggedIn)
  }

}
