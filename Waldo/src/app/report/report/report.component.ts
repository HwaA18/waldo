import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {}

  backToMap(): void {
    this.route.navigate(['tabs/tab1'])
  }

}
