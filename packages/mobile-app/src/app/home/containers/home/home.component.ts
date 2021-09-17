import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';

import { ModalComponent } from '../../components/modal/modal.component';

@Component({
    selector: 'home',
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent {
    constructor(
        private _vcRef: ViewContainerRef,
        private _modalService: ModalDialogService,
    ) { }

    public openModal(): void {
        const options: ModalDialogOptions = {
            viewContainerRef: this._vcRef,
            context: {
                id: 1,
            },
            fullscreen: true,
            animated: true,
        };

        this._modalService.showModal(ModalComponent, options);
    }
}
