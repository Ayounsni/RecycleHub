// confirmation-popup.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  @Output() confirmed = new EventEmitter<boolean>();

  onNoClick(): void {
    this.confirmed.emit(false);
  }

  onYesClick(): void {
    this.confirmed.emit(true);
  }
}