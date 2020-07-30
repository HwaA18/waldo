import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Config {
    username: string
    password: string
    firstName: string
    lastName: string
    address: string
}

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
}

export interface Loc {
    name: string
    lat: number
    long: number
    id: number
}

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