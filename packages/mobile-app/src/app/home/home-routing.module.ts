import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { HomeComponent } from "./containers/home/home.component";
import { ModalContentPageComponent } from './containers/modal-content/modal-content.component';

const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        children: [
            {
                path: "modal-content/:id",
                component: ModalContentPageComponent,
            }
        ]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
