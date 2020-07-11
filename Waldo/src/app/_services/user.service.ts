import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private user = new Subject<any>();
    private logStatus: boolean = false;

    sendStatus(status: boolean) {
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