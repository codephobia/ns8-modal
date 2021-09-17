import { Component, Input } from '@angular/core';

@Component({
    selector: 'modal-content',
    templateUrl: './modal-content.component.html',
    styleUrls: ['./modal-content.component.css'],
    moduleId: module.id,
})
export class ModalContentComponent {
    @Input()
    public id: string = '';
}
