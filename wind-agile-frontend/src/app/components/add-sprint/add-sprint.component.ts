import { Component, Inject ,Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SprintService } from 'src/app/services/sprint.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskUpdateService } from 'src/app/services/task-update.service';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrls: ['./add-sprint.component.scss']
})
export class AddSprintComponent {
  newSprint: any = {};

  @Output() sprintAdded: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddSprintComponent>,
  private sprintService: SprintService,
  private toastr: ToastrService,
  private taskUpdateService:TaskUpdateService,

  ) {

    console.log('ID du backlog reçu :', data.backlogId);
  }


addSprint(): void {
  this.sprintService.addSprint(this.newSprint, this.data.backlogId).subscribe(
    response => {
      console.log('Sprint ajouté avec succès :', response);
      this.toastr.success('Le sprint a été ajouté avec succès.', 'Succès', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
      this.sprintAdded.emit();
      this.taskUpdateService.sprintAddedForBacklog.emit(this.newSprint.id);

    },
    error => {
      console.error('Erreur lors de l\'ajout du sprint :', error);
      this.toastr.error('Une erreur est survenue lors de l\'ajout du sprint.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
    }
  );
}
closeDialog(): void {
  this.dialogRef.close();
}
}

