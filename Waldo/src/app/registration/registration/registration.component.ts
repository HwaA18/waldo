import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService, Config } from 'src/app/_services/index';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http'

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

  constructor(private userService: UserService, private route: Router, private http: HttpClient) {}

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
    this.first = this.capitalizeFirst(this.first.trim())
    this.last = this.capitalizeFirst(this.last.trim())
    this.user = this.user.trim()
    const data: Config[] = await this.http.get<Config[]>('https://localhost:5001/user/').toPromise();
    console.log(data)
    if (this.checkUsernameTaken(data)) {
      this.pass = this.pass.trim()
      this.pass2 = this.pass2.trim()
      this.street1 = this.street1.trim()
      this.street2 = this.street2.trim()
      this.city = this.city.trim()
      this.country = this.capitalizeFirst(this.country.trim())
      console.log(this.first + " " + this.last)
      var fullAddress: string
      if (this.pass == this.pass2){
        if (this.street2 != ''){
          fullAddress = this.street1+ ", " + this.street2 + ", " + this.city
        } else {
          fullAddress = this.street1+ ", " + this.city
        }
        fullAddress = this.capitalizeFirst(fullAddress) + ", " + this.state.toUpperCase() + " " + this.zip + ", " + this.country
        console.log(fullAddress)
        if (this.checkState()){
          console.log("Correct State")
          this.logIn(fullAddress)
          // const httpOptions = {
          //   headers: new HttpHeaders({
          //     'Content-Type' : 'application/json'
          //   })
          // }
          //const data2 = await this.http.post<boolean>('https://localhost:5001/user/post', {"username": this.user,"password": this.pass, "firstName": this.first, "lastName": this.last, "address": fullAddress}, httpOptions).toPromise();
          // console.log(data2)
          this.backToAccount()
        } else {
          console.log("Incorrect State")
        }
      } else {
        console.log("Passwords do not match.")
      }
    } else {
      console.log("Username taken")
    }
  }

  logIn(address: string): void {
    this.userService.sendStatus(["registration", true, this.first, this.last, address]);
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

}
