import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService, Config } from 'src/app/_services/index';
import { Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  //Each of the following fields retain information required to create a User in our SQL database
  first: string = ''
  last: string = ''
  user: string = ''
  pass: string = ''
  pass2: string = ''
  street1: string = ''
  street2: string = ''
  city: string = ''
  state: string = ''
  zip: number
  country: string = ''
  fullAddress: string = ''

  //The subscription connects the registration form to our UserService so that it can notify when a user is created and logs in
  subscription: Subscription

  //Establishes access to our UserService, a router, HTTPCleient and AlertController for later usage
  constructor(private userService: UserService, private route: Router, private http: HttpClient, public alertController: AlertController) {}

  //This function is used in multiple places in the form to capitalize the first letter of each word in a string
  capitalizeFirst(str) : string {
    return str.toLowerCase().split(' ').map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
  }

  //Checks whether the username entered is currently used in our database
  checkUsernameTaken(data: Config[]) : boolean {
    for (let i = 0; i < data.length; i++) {
      if (data[i]['username'] == this.user){
        return false
      }
    } 
    return true
  }

  //Navigates back to the account page 
  backToAccount(): void {
    this.route.navigate(['tabs/tab3'])
  }

  //When the user submits, this function formats the information and checks for potential errors before submitting to our API
  async processForm(){
    //Checks that all required fields are filled
    if (this.first != '' && this.last != '' && this.user != '' && this.pass != '' && this.pass2 != ''
      && this.street1 != '' && this.city != '' && this.zip != null && this.country != ''){
      //First, last and usernames are trimmed of white space and the current list of users is pulled from our database to check is the username is taken
      this.first = this.capitalizeFirst(this.first.trim())
      this.last = this.capitalizeFirst(this.last.trim())
      this.user = this.user.trim()
      const data: Config[] = await this.http.get<Config[]>('https://waldofind.azurewebsites.net/user').toPromise();
      if (this.checkUsernameTaken(data)) {
        //The password, the reentered password, the street address lines, city and country are all trimmed of whitespace and the country string is formatted
        this.pass = this.pass.trim()
        this.pass2 = this.pass2.trim()
        this.street1 = this.street1.trim()
        this.street2 = this.street2.trim()
        this.city = this.city.trim()
        this.country = this.capitalizeFirst(this.country.trim())

        //The password and password confirmation must match so that the user does not accidently mistype and locks themselves out
        if (this.pass == this.pass2){
          //The full address is then assembled, taking into account that street addresses may or may not have a second line
          if (this.street2 != ''){
            this.fullAddress = this.street1+ ", " + this.street2 + ", " + this.city
          } else {
            this.fullAddress = this.street1+ ", " + this.city
          }
          this.fullAddress = this.capitalizeFirst(this.fullAddress) + ", " + this.state.toUpperCase() + " " + this.zip + ", " + this.country
          /*This if statement checks that a valid state is provided. If it is valid, the user must confirm the correct data
            is entered. If the state is not valid, an invalid state error is presented. 
          */
          if (this.checkState()){
            this.entryConfirmation();
          } else {
            this.registrationError('Invalid state entered.')
          }
        } 
        //The user is notified if the password entered and the reentered password do not match
        else {
          this.registrationError('Entered passwords do not match.')
        }
      } 
      //If the username entered is already in use, the user is prompted to change it
      else {
        this.registrationError('The username entered is already taken.')
      }
    } 
    //If any required field is not filled out, the missing fields alert is triggered
    else {
      this.missingFields()
    }
  }

  //The registration will send a message through the userService to let all areas of the app know that a user has been signed in with this information
  logIn(address: string): void {
    this.userService.sendStatus(["registration", true, this.first, this.last, address, this.user]);
  }

  //Checks that the state the user entered is one of the 50 valid state codes
  checkState(): boolean {
    const states = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
      "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
      "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
      "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]
    for (let i = 0; i < 50; i++){
      if (this.state.toUpperCase() == states[i]){
        return true
      }
    }
    return false
  }

  //ALERT BUTTONS

  /*This alert box will display the first name, last name, username and address entered by the user to confirm the information is 
    correct. The user can either go back and edit the information or confirm the information, log in and be directed to the account page. 
  */
  async entryConfirmation() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Is this the correct information?',
      message: 'Please confirm that you supplied the correct information, or click \"<strong>Cancel</strong>\" to continue editing.' + 
        '<br><br><strong>First Name:</strong> ' + this.first + '<br><strong>Last Name:</strong> ' + this.last + 
        '<br><strong>Userame:</strong> ' + this.user + '<br><strong>Address:</strong> ' + this.fullAddress,
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
          handler: async () => {
            console.log('Confirm Ok');

            //using the specified http headers, the user information is sent to our API
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type' : 'application/json'
              })
            }
            const data2 = await this.http.post<boolean>('https://waldofind.azurewebsites.net/user/post', {"username": this.user,"password": this.pass, "firstName": this.first, "lastName": this.last, "address": this.fullAddress}, httpOptions).toPromise();
            this.logIn(this.fullAddress)
            this.backToAccount()
          }
        }
      ]
    });
    await alert.present();
  }

  //The alert box will notify the user that all fields, except for street address line 2 ust be filled out
  async missingFields() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Missing Fields',
      message: 'Please fill out mandatory fields. Address line 2 is the only non-mandatory line.',
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

  //This alert takes in a particular message to display so that it may be used for multiple errors. 
  async registrationError(text: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Registration Error',
      message: text,
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
