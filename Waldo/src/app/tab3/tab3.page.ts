import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { UserService } from '../_services/index';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../_services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page implements OnInit {

  //Boolean to dictate whether a user is logged in
  loggedIn: boolean; 

  //Fields for the username and password populated by the user
  username: string = ''
  password: string = ''

  //Fields that will hold the information for the user when verified, currently has filler information
  firstName: string = 'Starter First Name'
  lastName: string = 'Starter Last Name'
  address: string = 'Starter Address'

  //The subscription connects the registration form to our UserService so that it can notify when a user is created and logs in
  userSubscription: Subscription;

  /*Establishes access to HTTPCient, alertController, and our userService. Within the constructor, the rules of the subscription 
    to our userService are set. The userService information varies based on whether a new account is created or an existing 
    account is used, and is parsed accordingly.
  */
  constructor(private userService: UserService, public alertController: AlertController, private http: HttpClient) {
    this.userSubscription = this.userService.onStatus().subscribe(status => {
      if (status[0] == "account"){
        this.loggedIn = status[1]
      } else if (status[0] == "registration"){
        this.loggedIn = status[1]
        this.firstName = status[2]
        this.lastName = status[3]
        this.address = status[4]
      } else {
        this.loggedIn = status[0]
      }
    })
  }

  /*Triggered when the user hits the log in button. First, we check that the username and password fields are populated. 
    If not, an alert is triggered. If they are populated, the user data we have in our database is gathered. We then search
    through our user data to see if there is a user with the entered username AND password. If there is not a user with this
    information an alert is triggered. If there is such a user, a message is sent to our UserService that a  user is logged in.
  */
  async logIn() {
    if (this.username && this.password){
      const data: Config[] = await this.http.get<Config[]>('https://waldofind.azurewebsites.net/user').toPromise();
      var match = false;
      var count = 0;
      while (!match && count < data.length){
        if (data[count]["username"] == this.username && data[count]["password"] == this.password){
          match = true
          this.firstName = data[count]["firstName"]
          this.lastName = data[count]["lastName"]
          this.address = data[count]["address"]
        }
        count = count + 1;
      }
      if (match){
        this.userService.sendStatus(["account", true, this.username]);
      } else {
        this.incorrectCredentials()
        console.log("Incorrect Credentials")
      }  
    } else {
      this.missingLogin()
    }
  }

  //Logging out will clear all the fields associated with a user and updates the UserService status
  logOut(): void {
    this.username = ''
    this.password = ''
    this.firstName = ''
    this.lastName = ''
    this.address = ''
    this.userService.sendStatus(["account", false, this.username]);
  }

  //OnInit the page will gather the log in status of a user
  ngOnInit() : void {
    this.userService.getStatus();
  }

  //ALERT BOXES

  //If the user did not fill in the username and/or password field and attempts to log in, this alert triggers
  async missingLogin() {
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

  //This is an alert box for when a user does not provide correct credentials
  async incorrectCredentials() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Incorrect Credentials',
      message: 'The Username and/or Password Fields are incorrect.',
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
}
