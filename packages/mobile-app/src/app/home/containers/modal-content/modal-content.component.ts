import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '@nativescript/core';

@Component({
    selector: 'modal-content-page',
    templateUrl: './modal-content.component.html',
    styleUrls: ['./modal-content.component.css'],
    moduleId: module.id,
})
export class ModalContentPageComponent implements OnInit {
    public id: string;

    constructor(
        private _page: Page,
        private _route: ActivatedRoute,
    ) {
        this._page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.id = this._route.snapshot.paramMap.get('id');
    }
}
