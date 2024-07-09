import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-image-screen-dialog',
  templateUrl: './image-screen-dialog.component.html',
  styleUrls: ['./image-screen-dialog.component.scss']
})
export class ImageScreenDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}


}
