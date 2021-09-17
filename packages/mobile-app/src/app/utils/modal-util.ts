import { Page, Color, isAndroid, View } from '@nativescript/core';

import { CustomDialogFragmentImpl, DOM_ID, modalMap, CustomDialogOptions } from './custom-dialog-fragment-impl.class';

const viewCommon = require("@nativescript/core/ui/core/view/view-common").ViewCommon;

export class XzDialogUtil {
    // call this method once
    static overrideModalViewMethod() {
        if (isAndroid) {
            (<any>View).prototype._showNativeModalView = function (
                parent: any,
                context: any,
                closeCallback: () => void,
                fullscreen?: boolean,
                animated?: boolean,
                stretched?: boolean
            ) {
                viewCommon.prototype._showNativeModalView.call(
                    this,
                    parent,
                    context,
                    closeCallback,
                    fullscreen,
                    stretched
                );
                if (!this.backgroundColor) {
                    this.backgroundColor = new Color("transparent");
                }
                this._setupUI(parent._context);
                this._isAddedToNativeVisualTree = true;

                const df = new CustomDialogFragmentImpl();
                const args = new android.os.Bundle();
                args.putInt(DOM_ID, this._domId);
                df.setArguments(args);

                const dialogOptions: CustomDialogOptions = {
                    owner: this,
                    fullscreen: !!fullscreen,
                    stretched: !!stretched,
                    shownCallback: () => this._raiseShownModallyEvent(),
                    dismissCallback: () => this.closeModal()
                };
                modalMap.set(dialogOptions.owner._domId, dialogOptions);

                this._dialogFragment = df;

                viewCommon.prototype._raiseShowingModallyEvent.call(this);

                this._dialogFragment.show(
                    parent._getFragmentManager(),
                    this._domId.toString()
                );
            };
        }
    }

    static makeTransparentDialog(page: Page, alpha: number = 50) {
        if (page.ios) {
            // iOS by default won't let us have a transparent background on a modal
            // Ugly workaround from: https://github.com/NativeScript/nativescript/issues/2086#issuecomment-221956483
            page.backgroundColor = new Color(255 * (alpha / 100), 0, 0, 0);
        } else {
            // Android
            page.backgroundColor = new Color(255 * (alpha / 100), 0, 0, 0);
        }
    }
}
