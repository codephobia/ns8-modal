import { Component, Inject, Injector, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ModalService } from '../../../services/modal.service';
import { BOTTOM_SHEET_INPUT_TOKEN } from '~/app/tokens/bottom-sheet-input.token';

@Component({
    selector: 'bottom-sheet',
    templateUrl: './bottom-sheet.component.html',
    styleUrls: ['./bottom-sheet.component.css'],
    moduleId: module.id,
})
export class BottomSheetComponent implements OnInit, OnDestroy {
    public id: string;
    private _destroy$ = new Subject<void>();

    constructor(
        private _injector: Injector,
        private _router: RouterExtensions,
        private _modalService: ModalService,
        @Inject(BOTTOM_SHEET_INPUT_TOKEN) @Optional() private _input?: any,
    ) {
        if (this._input) {
            this.id = this._input.id;
            console.log({ id: this.id });
        }
    }

    public ngOnInit(): void {
        this._loadInitialRoute();
        this._handleModalClose();
    }

    public close(): void {
        this._modalService.closeAll();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
    }

    private _loadInitialRoute(): void {
        this._router.navigate(
            // ['home', 'modal-content', this.id],
            ['home', 'modal-content', this.id],
        );
    }

    private _handleModalClose(): void {
        this._modalService.closed$.pipe(
            takeUntil(this._destroy$)
        ).subscribe(() => {
            this._modalService.closeAll();
        });
    }
}
