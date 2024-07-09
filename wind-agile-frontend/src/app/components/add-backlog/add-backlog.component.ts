import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BacklogService } from 'src/app/services/backlog.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-backlog',
  templateUrl: './add-backlog.component.html',
  styleUrls: ['./add-backlog.component.scss']
})
export class AddBacklogComponent {
  projectId: number;
  @Output() backlogAdded: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddBacklogComponent>,
  private toastr: ToastrService,

  private backlogService: BacklogService,
  private sharedService: SharedService

  ) {
    this.projectId = this.data.projectId;
  }
  createBacklog(projectId: number, form: NgForm): void {
    if (form.valid) {
      const backlogData = form.value;

      this.backlogService.createBacklog(projectId, backlogData).subscribe(
        (response) => {
          console.log('Backlog créé avec succès :', response);
          this.toastr.success('Le backlog a été créé avec succès', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
          this.backlogAdded.emit();
          this.sharedService.notifyBacklogCreated();
          this.sharedService.backlogAddedForSprint.emit(response.id);

          this.dialogRef.close();
        },
        (error) => {
          console.error('Erreur lors de la création du backlog :', error);
          this.toastr.error('Une erreur s\'est produite lors de la création du backlog', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
        }
      );
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
