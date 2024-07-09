import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SprintService } from 'src/app/services/sprint.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-sprint-dialog',
  templateUrl: './update-sprint-dialog.component.html',
  styleUrls: ['./update-sprint-dialog.component.scss']
})
export class UpdateSprintDialogComponent implements OnInit {
  sprint: any;
  @Output() sprintUpdated: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateSprintDialogComponent>,
     private sprintService: SprintService,
     private toastr: ToastrService
  ) {
    console.log('Données reçues dans le dialogue de mise à jour du sprint :', data);
  }
  ngOnInit(): void {
    if (this.data && this.data.sprintId) {
      this.getSprintDetails(this.data.sprintId);
    }
  }
  getSprintDetails(sprintId: number): void {
    this.sprintService.getSprintById(sprintId).subscribe(
      (sprintData: any) => {
        this.sprint = sprintData;
        console.log('Détails du sprint récupérés avec succès :', this.sprint);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails du sprint :', error);
      }
    );
  }
  updateSprint(): void {
    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour le sprint ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.sprint) {
          this.sprintService.updateSprint(this.sprint.id, this.sprint).subscribe(
            (updatedSprint: any) => {
              console.log('Sprint mis à jour avec succès :', updatedSprint);
              this.toastr.success('Le sprint a été mis à jour avec succès!', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
              this.sprintUpdated.emit();
              this.dialogRef.close();
            },
            (error) => {
              console.error('Une erreur s\'est produite lors de la mise à jour du sprint :', error);
              this.toastr.error('Une erreur s\'est produite lors de la mise à jour du sprint.', 'Erreur', {
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
