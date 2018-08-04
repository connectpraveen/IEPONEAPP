import { Injectable, Directive } from '@angular/core';
@Injectable()
export class GlobalService {
    private UserName: string;
    constructor() { }
    setUserName(val) {
        this.UserName = val;
    }

    getUserName() {
        return this.UserName;
    }
}
