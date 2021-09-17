import { Component, ViewContainerRef } from "@angular/core";
import { NativeDialogConfig, NativeDialogService } from '@nativescript/angular';

import { ModalComponent } from '../../components/modal/modal.component';

@Component({
    selector: 'home',
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent {
    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _nativeDialogService: NativeDialogService,
    ) { }

    public openModal(): void {
        const options: NativeDialogConfig = {
            viewContainerRef: this._viewContainerRef,
            data: {
                id: 1,
            },
            nativeOptions: {
                fullscreen: true,
            },
        };

        this._nativeDialogService.open(ModalComponent, options)
            .afterClosed()
            .subscribe((result) => {
                console.log('MODAL CLOSED:', result);
            });;
    }
}
