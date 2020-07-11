import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/_services/index';
import { Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  subscription: Subscription
  first: string = ''
  last: string = ''

  constructor(private userService: UserService, private route: Router) {}

  backToAccount(): void {
    this.route.navigate(['tabs/tab3'])
  }

  processForm(): void {
    console.log("Form Submitted.")
    console.log(this.first + " " + this.last)
  }

  logIn(): void {
    this.userService.sendStatus(true);
  }

  logOut(): void {
    this.userService.sendStatus(false);
  }

  ngOnInit() {}

}
