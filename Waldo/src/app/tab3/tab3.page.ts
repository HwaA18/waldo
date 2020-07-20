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
  submitted: string = 'Your Form Has Been Submitted'
  firstName: string = 'Starter First Name'
  lastName: string = 'Starter Last Name'
  loggedIn: boolean; 
  username: string = ''
  password: string = ''
  check: any[];

  api: Config[];
  api2: string;
  post: any;

  userSubscription: Subscription;

  constructor(private userService: UserService, public alertController: AlertController, private http: HttpClient) {
    this.userSubscription = this.userService.onStatus().subscribe(status => {
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

  async logIn() {
    console.log("Recorded from Login:")
    console.log(this.username + " " + this.password)
    //Still experimenting with how to display the info that comes back from the server
    //this.http.get('https://localhost:5001/user').subscribe(
      //(data: Config[]) => this.api = data
    //)
    //this.http.get('https://localhost:5001/user/get/1',{responseType:'text'}).subscribe(
      //(data: string) => this.api2 = data
    //)

    const data = await this.http.get('https://localhost:5001/user/', {responseType: 'json'}).toPromise();
    console.log(data[0]['username'])

    if (this.username && this.password){
      this.userService.sendStatus(["account", true]);
    } else {
      this.presentMultipleAlertButtons()
    }
    //console.log('From api: ' + this.api[0]['username'])
    //console.log('From api: ' + this.api2);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    }

    const data2 = await this.http.post<boolean>('https://localhost:5001/user/post', {"username":"ctang","password":"test1"}, httpOptions).toPromise();
    console.log(data2)
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
