import { Application } from '@nativescript/core';

import { CustomDialogFragmentImpl } from './custom-dialog-fragment-impl.class';

// @NativeClass()
class CustomDialogImpl extends android.app.Dialog {
    constructor(
        public fragment: CustomDialogFragmentImpl,
        context: android.content.Context,
        themeResId: number
    ) {
        super(context, themeResId);
        return global.__native(this);
    }

    public onDetachedFromWindow(): void {
        super.onDetachedFromWindow();
        this.fragment = null;
    }

    public onBackPressed(): void {
        const view = this.fragment.owner;
        const args = {
            eventName: "activityBackPressed",
            object: view,
            activity: view._context,
            cancel: false
        };

        // Fist fire application.android global event
        Application.android.notify(args);
        if (args.cancel) {
            return;
        }

        view.notify(args);

        if (!args.cancel && !view.onBackPressed()) {
            super.onBackPressed();
        }
    }
}

export { CustomDialogImpl };
