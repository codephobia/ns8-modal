import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { XzDialogUtil } from './utils/modal-util'

@Component({
    selector: 'ns-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(
        private _router: Router,
    ) {
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((val) => {
            console.log(val);
        });
    }

    public ngOnInit(): void {
        XzDialogUtil.overrideModalViewMethod();
    }
}
