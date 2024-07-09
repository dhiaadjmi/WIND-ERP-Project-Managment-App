import { Component, OnInit, ViewChild, ElementRef, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  selectedImages: string[] = [];
  imagesUploaded: EventEmitter<void> = new EventEmitter<void>();


  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  taskId: number;

  constructor(
    private dialog: MatDialog,
    private taskService:TaskService,
    private snackBar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImageDialogComponent>
  ) {
    this.taskId = data.taskId;
  }

  ngOnInit(): void {
    console.log("image task id ", this.taskId)
  }

  openFileChooser(): void {
    this.fileInput.nativeElement.click();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files: FileList | null = target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  confirmUpload(): void {
    const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;
    if (fileInputElement && fileInputElement.files) {
      const files: FileList = fileInputElement.files;
      if (files.length > 0) {
        const formData: FormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        this.taskService.uploadTaskImages(this.taskId, formData).subscribe(response => {
          console.log('Images uploaded successfully:', response);
          this.imagesUploaded.emit();

          this.dialogRef.close();
          this.showSuccessSnackBar('Images uploaded successfully');
        }, error => {
          console.error('Failed to upload images:', error);
          this.showErrorSnackBar('Failed to upload images');
        });
      } else {
        console.warn('No images selected.');
      }
    } else {
      console.error('File input element or files list is not defined.');
    }
  }

  showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  cancelImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }


}
