import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Screen } from '@nativescript/core';
import { View, LayoutBase, PanGestureEventData } from '@nativescript/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _panAnimationDuration = 200;
    private _panCloseThreshold = 150;
    private _closed = new Subject<void>();

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
