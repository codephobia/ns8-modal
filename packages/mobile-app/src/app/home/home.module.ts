import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./containers/home/home.component";
import { ModalComponent } from './components/modal/modal.component';
import { ModalContentPageComponent } from './containers/modal-content/modal-content.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
        ModalComponent,
        ModalContentPageComponent,
        ModalContentComponent,
    ],
    entryComponents: [
        ModalComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
