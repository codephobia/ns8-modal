import { Component, ViewContainerRef } from "@angular/core";
import { NativeDialogConfig, NativeDialogService } from '@nativescript/angular';

import { ModalService } from '~/app/services/modal.service';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';
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
        private _modalService: ModalService,
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

    public openRootLayoutBottomSheet(): void {
        this._modalService.openBottomSheet(BottomSheetComponent, { id: '10' });
    }
}
