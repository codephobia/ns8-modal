import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'modal-content-page',
    templateUrl: './modal-content.component.html',
    styleUrls: ['./modal-content.component.css'],
    moduleId: module.id,
})
export class ModalContentPageComponent implements OnInit {
    public id: string;

    constructor(
        private _route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.id = this._route.snapshot.paramMap.get('id');
    }
}
