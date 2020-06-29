import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss']
})
export class Tab3Page {
  submitted: string = 'Your Form Has Been Submitted'
  firstName: string = ''
  lastName: string = ''

  constructor() {}

  processForm(): void {
    console.log(this.submitted)
    console.log(this.firstName + " " + this.lastName)
  }

}
