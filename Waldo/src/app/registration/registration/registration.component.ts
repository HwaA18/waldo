import { Component, OnInit } from '@angular/core';
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
export class RegistrationComponent implements OnInit {
  subscription: Subscription
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

  constructor(private userService: UserService, private route: Router, private http: HttpClient, public alertController: AlertController) {}

  capitalizeFirst(str) : string {
    return str.toLowerCase().split(' ').map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
  }

  checkUsernameTaken(data: Config[]) : boolean {
    for (let i = 0; i < data.length; i++) {
      if (data[i]['username'] == this.user){
        return false
      }
    } 
    return true
  }

  backToAccount(): void {
    this.route.navigate(['tabs/tab3'])
  }

  async processForm(){
    console.log("Form Submitted.")
    if (this.first != '' && this.last != '' && this.user != '' && this.pass != '' && this.pass2 != ''
      && this.street1 != '' && this.city != '' && this.zip != null && this.country != ''){
      this.first = this.capitalizeFirst(this.first.trim())
      this.last = this.capitalizeFirst(this.last.trim())
      this.user = this.user.trim()
      const data: Config[] = await this.http.get<Config[]>('https://waldofind.azurewebsites.net/user').toPromise();
      console.log(data)
      if (this.checkUsernameTaken(data)) {
        this.pass = this.pass.trim()
        this.pass2 = this.pass2.trim()
        this.street1 = this.street1.trim()
        this.street2 = this.street2.trim()
        this.city = this.city.trim()
        this.country = this.capitalizeFirst(this.country.trim())
        console.log(this.first + " " + this.last)
        if (this.pass == this.pass2){
          if (this.street2 != ''){
            this.fullAddress = this.street1+ ", " + this.street2 + ", " + this.city
          } else {
            this.fullAddress = this.street1+ ", " + this.city
          }
          this.fullAddress = this.capitalizeFirst(this.fullAddress) + ", " + this.state.toUpperCase() + " " + this.zip + ", " + this.country
          console.log(this.fullAddress)
          if (this.checkState()){
            console.log("Correct State")
            this.logIn(this.fullAddress)
            this.entryConfirmation();
          } else {
            this.registrationError('Invalid state entered.')
          }
        } else {
          this.registrationError('Entered passwords do not match.')
        }
      } else {
        this.registrationError('The username entered is already taken.')
      }
    } else {
      this.missingFields()
    }
  }

  logIn(address: string): void {
    this.userService.sendStatus(["registration", true, this.first, this.last, address, this.user]);
  }

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

  ngOnInit() {}


  //ALERT BUTTONS
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
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type' : 'application/json'
              })
            }
            const data2 = await this.http.post<boolean>('https://waldofind.azurewebsites.net/user/post', {"username": this.user,"password": this.pass, "firstName": this.first, "lastName": this.last, "address": this.fullAddress}, httpOptions).toPromise();
            console.log(data2)
            this.backToAccount()
          }
        }
      ]
    });
    await alert.present();
  }

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
