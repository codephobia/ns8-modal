import { Page } from '@nativescript/core';

export function BasePage() {
    return (target: any) => {
        const ngOnInit = target.prototype.ngOnInit;
        const ngOnDestroy = target.prototype.ngOnDestroy;

        target.prototype.ngOnInit = function (...args: any[]) {
            if (this._injector) {
                const page: Page = this._injector.get(Page);

                page.once(Page.unloadedEvent, (event: any) => {
                    ngOnDestroy && ngOnDestroy.apply(this);
                });
            } else {
                console.warn("Please provide Injector in the constructor");
            }

            ngOnInit && ngOnInit.apply(this);
        };
    };
}
