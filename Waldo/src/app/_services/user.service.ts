import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

//The config interface contains the fields relevant to user logins and records in our SQL database
export interface Config {
    username: string
    password: string
    firstName: string
    lastName: string
    address: string
}

//The store interface contains the fields relevant to reports on stores in our SQL database
export interface Store {
    name: string
    latitude: string
    longitude: string
    address: string
    masksRequired: string
    masks: string
    gloves: string
    handSanitizer: string
    paperTowels: string
    toiletPaper: string
    liquidSoap: string
    barSoap: string
    cleaningWipes: string
    aerosolDisinfectant: string
    bleach: string
    flushableWipes: string
    tissues: string
    diapers: string
    waterFilters: string
    coldRemedies: string
    coughRemedies: string
    rubbingAlcohol: string
    antiseptic: string
    thermometer: string
    firstAidKit: string
    waterBottles: string
    eggs: string
    milk: string
    bread: string
    beef: string
    chicken: string
    pork: string
    yeast: string
    reportedBy: string
    timestamp: string
}

export interface Loc {
    name: string
    lat: number
    long: number
    id: number
}

//The UserService is used to track accross the application if a user is logged in
@Injectable({ providedIn: 'root' })
export class UserService {
    private user = new Subject<any>();
    private logStatus: any[] = [false];

    sendStatus(status: any[]) {
        this.logStatus = status;
        this.user.next(this.logStatus );
    }

    onStatus(): Observable<any> {
        return this.user.asObservable();
    }

    getStatus() {
        this.user.next(this.logStatus)
    }

}

//The MapService is used to cause a reset in the map page so that it will show the most up to date data
@Injectable({ providedIn: 'root' })
export class MapService {
    private map = new Subject<any>();

    sendStatus(status: any) {
        this.map.next(status);
    }

    onStatus(): Observable<any> {
        return this.map.asObservable();
    }

}