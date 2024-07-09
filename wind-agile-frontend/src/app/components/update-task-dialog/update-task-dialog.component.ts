import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-task-dialog',
  templateUrl: './update-task-dialog.component.html',
  styleUrls: ['./update-task-dialog.component.scss']
})
export class UpdateTaskDialogComponent {
  task: any;
  @Output() taskUpdated: EventEmitter<any> = new EventEmitter();
  @Output() taskUpdatedTimeline: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,   private dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
   private taskService: TaskService,
   private taskUpdateService:TaskUpdateService,
   private toastr: ToastrService

  ) {
    console.log('Données reçues dans le dialogue de mise à jour du sprint :', data);
  }
  ngOnInit(): void {
    if (this.data && this.data.taskId) {
      this.getTaskDetails(this.data.taskId);
    }
  }

  getTaskDetails(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe(
      (sprintData: any) => {
        this.task = sprintData;
        console.log('Détails du task récupérés avec succès :', this.task);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails du task :', error);
      }
    );
  }
  updateTask(): void {
    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour la tâche ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.task) {
          this.taskService.updateTask(this.task.id, this.task).subscribe(
            (updatedTask: any) => {
              console.log('Tâche mise à jour avec succès :', updatedTask);
              this.toastr.success('La tâche a été mise à jour avec succès!', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
              this.taskUpdated.emit();
              this.taskUpdateService.taskUpdatedTimeline.emit();
              this.dialogRef.close();
            },
            (error) => {
              console.error('Une erreur s\'est produite lors de la mise à jour de la tâche :', error);
              this.toastr.error('Une erreur s\'est produite lors de la mise à jour de la tâche.', 'Erreur', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
            }
          );
        }
      }
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
