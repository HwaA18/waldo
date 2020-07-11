import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../_services/index';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page implements OnInit {
  submitted: string = 'Your Form Has Been Submitted'
  firstName: string = ''
  lastName: string = ''
  loggedIn: boolean; 

  subscription: Subscription;

  constructor(private userService: UserService, public alertController: AlertController) {
    this.subscription = this.userService.onStatus().subscribe(status => {
      this.loggedIn = status;
    })
  }

//This is an alert box for when someone doesn't fill out the correct fields.
  async presentMultipleAlertButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'First and Last names are mandatory fields.',
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
    this.userService.sendStatus(true);
  }

  logOut(): void {
    this.userService.sendStatus(false);
  }

  ngOnInit() : void {
    this.userService.getStatus();
    console.log(this.loggedIn)
  }

}
