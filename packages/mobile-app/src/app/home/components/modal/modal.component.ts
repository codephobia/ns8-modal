import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogParams, RouterExtensions } from '@nativescript/angular';
import { Page, View } from '@nativescript/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { XzDialogUtil } from '../../../utils/modal-util';
import { BasePage } from '../../../utils/decorators/base-page.decorator';
import { ModalService } from '../../../services/modal.service';

@BasePage()
@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    moduleId: module.id,
})
export class ModalComponent implements OnInit, OnDestroy {
    public id: string;
    private _animationDuration = 500;
    private _destroy$ = new Subject<void>();

    constructor(
        private _injector: Injector,
        private _params: ModalDialogParams,
        private _page: Page,
        private _router: RouterExtensions,
        private _route: ActivatedRoute,
        private _modalService: ModalService,
    ) {
        XzDialogUtil.makeTransparentDialog(this._page, 90);
        this.id = this._params.context.id;
    }

    public ngOnInit(): void {
        this._loadInitialRoute();
        this._handleModalClose();
    }

    public onModalLoaded(target: View): void {
        // target.animate({
        //     opacity: 0,
        //     duration: 0,
        // })
        //     .then(() => target.animate({
        //         opacity: 1,
        //         duration: this._animationDuration
        //     }))
        //     .catch((e: Error) => {
        //         console.log(e.message);
        //     });
    }

    public onContentLoaded(target: View): void {
        // target.animate({
        //     opacity: 0,
        //     translate: { y: 600, x: 0 },
        //     duration: 0,
        // })
        //     .then(() => target.animate({
        //         opacity: 1,
        //         translate: { y: 0, x: 0 },
        //         duration: this._animationDuration
        //     }))
        //     .catch((e: Error) => {
        //         console.log(e.message);
        //     });
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
    }

    private _loadInitialRoute(): void {
        this._router.navigate(
            ['modal-content', this.id],
            { relativeTo: this._route },
        );
    }

    private _handleModalClose(): void {
        this._modalService.closed$.pipe(
            takeUntil(this._destroy$)
        ).subscribe(() => {
            this._params.closeCallback();
        });
    }
}
