import { ComponentRef, ElementRef, Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CoreTypes, getRootLayout, RootLayoutOptions, Screen } from '@nativescript/core';
import { View, LayoutBase, PanGestureEventData } from '@nativescript/core';
import { generateNativeScriptView } from '@nativescript/angular';

import { BOTTOM_SHEET_INPUT_TOKEN } from '../tokens/bottom-sheet-input.token';

export const DEFAULT_ANIMATION_CURVE = CoreTypes.AnimationCurve.cubicBezier(0.17, 0.89, 0.24, 1.11);
export const DEFAULT_ROOT_LAYOUT_OPTIONS = {
    shadeCover: {
        color: '#000',
        opacity: 0.7,
        tapToClose: true,
    },
    animation: {
        enterFrom: {
            translateY: 500,
            opacity: 0,
            duration: 300,
            curve: DEFAULT_ANIMATION_CURVE,
        },
        exitTo: {
            translateY: 500,
            opacity: 0,
            duration: 300,
            curve: DEFAULT_ANIMATION_CURVE,
        },
    },
};

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _panAnimationDuration = 200;
    private _panCloseThreshold = 150;
    private _bottomSheetView: View | null = null;
    private _closed = new Subject<void>();

    constructor(
        private _injector: Injector,
    ) { }

    public openBottomSheet<T>(component: Type<T> | TemplateRef<T>, input: any = {}, options: RootLayoutOptions = DEFAULT_ROOT_LAYOUT_OPTIONS): void {
        this._getView(component, input).then(v => {
            this._bottomSheetView = v;
            getRootLayout()
                .open(this._bottomSheetView, options)
                .then(() => {
                    console.log('opened');
                })
                .catch(err => {
                    console.log('error opening:', err);
                });
        })
    }

    public bringBottomSheetToFront(): Promise<void> {
        if (!this._bottomSheetView) {
            return;
        }

        return getRootLayout().bringToFront(this._bottomSheetView);
    }

    public closeBottomSheet(): void {
        if (!this._bottomSheetView) {
            return;
        }

        getRootLayout()
            .close(this._bottomSheetView)
            .then(() => {
                this._destroyNgRef(this._bottomSheetView);
                this._bottomSheetView = null;
                console.log('closed');
            })
            .catch((err) => {
                console.log('error closing', err);
            });
    }

    public get closed$(): Observable<void> {
        return this._closed.asObservable();
    }

    public onPan<T extends LayoutBase>(elRef: ElementRef<T>, { state, deltaY }: PanGestureEventData): void {
        const modalEl = elRef.nativeElement;

        if (state === 2) {
            if (deltaY > 0) {
                modalEl.translateY = deltaY;
            }
            return;
        } else if (state === 3) {
            if (deltaY > this._panCloseThreshold) {
                this._panComplete(modalEl);
                return;
            }

            this._panReset(modalEl);
        }

    }

    public close(): void {
        this._closed.next();
    }

    public closeAll(): void {
        getRootLayout().closeAll();
    }

    private _getView<T>(component: Type<T> | TemplateRef<T>, input?: any): Promise<View> {
        return new Promise(resolve => {
            const injector = Injector.create({
                providers: [{ provide: BOTTOM_SHEET_INPUT_TOKEN, useValue: input }],
                parent: this._injector,
            });
            const cmpRef = generateNativeScriptView(component, {
                injector,
            });
            (<any>cmpRef.firstNativeLikeView).__ngRef = cmpRef.ref;
            resolve(cmpRef.firstNativeLikeView);
        });
    }

    private _destroyNgRef(view: View): void {
        if ((<any>view).__ngRef) {
            ((<any>view).__ngRef as ComponentRef<View>).destroy();
        }
    }

    private _panComplete(modalEl: View): void {
        const scale = Screen.mainScreen.scale;
        const height = modalEl.getMeasuredHeight() / scale;

        modalEl.animate({
            translate: {
                y: height,
                x: 0,
            },
            duration: this._panAnimationDuration,
        }).then(() => {
            this.close();
        }).catch((e: Error) => {
            console.log(e.message);
        });

    }

    private _panReset(modalEl: View): void {
        modalEl.animate({
            translate: {
                y: 0,
                x: 0,
            },
            duration: this._panAnimationDuration,
        }).catch((e: Error) => {
            console.log(e.message);
        });
    }
}
