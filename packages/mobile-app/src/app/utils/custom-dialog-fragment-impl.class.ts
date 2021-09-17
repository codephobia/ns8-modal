import { View } from '@nativescript/core';

import { CustomDialogImpl } from './custom-dialog-impl.class';

export const DOM_ID = "_domId";
export const modalMap = new Map<number, CustomDialogOptions>();

export interface CustomDialogOptions {
    owner: View;
    fullscreen: boolean;
    stretched: boolean;
    shownCallback: () => void;
    dismissCallback: () => void;
}

// @NativeClass()
class CustomDialogFragmentImpl extends androidx.fragment.app.DialogFragment {
    public owner: View;
    private _fullscreen: boolean;
    private _stretched: boolean;
    private _cancelable: boolean;
    private _shownCallback: () => void;
    private _dismissCallback: () => void;

    constructor() {
        super();

        return global.__native(this);
    }

    public onCreateDialog(
        savedInstanceState: android.os.Bundle
    ): android.app.Dialog {
        const ownerId = this.getArguments().getInt(DOM_ID);
        const options = modalMap.get(ownerId);
        this.owner = options.owner;
        this._fullscreen = options.fullscreen;
        this._stretched = options.stretched;
        this._dismissCallback = options.dismissCallback;
        this._shownCallback = options.shownCallback;
        this.setStyle(
            androidx.fragment.app.DialogFragment
                .STYLE_NO_TITLE,
            0
        );

        var resources = this.getActivity().getResources();
        var theme = resources.getIdentifier(
            'WhiteDialogTheme',
            'style',
            this.getActivity()
                .getApplication()
                .getPackageName()
        );


        const dialog = new CustomDialogImpl(
            this,
            this.getActivity(),
            theme
        );

        // do not override alignment unless fullscreen modal will be shown;
        // otherwise we might break component-level layout:
        // https://github.com/NativeScript/NativeScript/issues/5392
        if (!this._fullscreen && !this._stretched) {
            this.owner.horizontalAlignment = "center";
            this.owner.verticalAlignment = "middle";
        } else {
            this.owner.horizontalAlignment = "stretch";
            this.owner.verticalAlignment = "stretch";
        }

        dialog.setCanceledOnTouchOutside(this._cancelable);

        const window = dialog.getWindow();
        window.setBackgroundDrawable(
            new android.graphics.drawable.ColorDrawable(
                android.graphics.Color.TRANSPARENT
            )
        );

        return dialog;
    }

    public onCreateView(
        inflater: android.view.LayoutInflater,
        container: android.view.ViewGroup,
        savedInstanceState: android.os.Bundle
    ): android.view.View {
        const owner = this.owner;
        (owner as any)._setupAsRootView(this.getActivity());
        owner._isAddedToNativeVisualTree = true;

        return owner.nativeViewProtected;
    }

    public onStart(): void {
        super.onStart();
        if (this._fullscreen) {
            const window = this.getDialog().getWindow();
            const length =
                android.view.ViewGroup.LayoutParams
                    .MATCH_PARENT;
            window.setLayout(length, length);
            // This removes the default backgroundDrawable so there are no margins.
            window.setBackgroundDrawable(null);
        }

        const owner = this.owner;
        if (owner && !owner.isLoaded) {
            (owner as any).callLoaded();
        }

        this._shownCallback();
    }

    public onDismiss(
        dialog: android.content.DialogInterface
    ): void {
        super.onDismiss(dialog);
        const manager = this.getFragmentManager();
        if (manager) {
            this._dismissCallback();
        }

        const owner = this.owner;
        if (owner && owner.isLoaded) {
            (owner as any).callUnloaded();
        }
    }

    public onDestroy(): void {
        super.onDestroy();
        const owner = this.owner;

        if (owner) {
            // Android calls onDestroy before onDismiss.
            // Make sure we unload first and then call _tearDownUI.
            if (owner.isLoaded) {
                (owner as any).callUnloaded();
            }

            owner._isAddedToNativeVisualTree = false;
            owner._tearDownUI(true);
        }
    }
}

export { CustomDialogFragmentImpl };
