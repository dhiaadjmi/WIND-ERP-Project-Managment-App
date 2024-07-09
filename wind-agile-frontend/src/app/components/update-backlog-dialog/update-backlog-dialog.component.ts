import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BacklogService } from 'src/app/services/backlog.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-update-backlog-dialog',
  templateUrl: './update-backlog-dialog.component.html',
  styleUrls: ['./update-backlog-dialog.component.scss']
})
export class UpdateBacklogDialogComponent {
  backlog: any;
  @Output() backlogUpdated: EventEmitter<any> = new EventEmitter();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateBacklogDialogComponent>,
    private backlogService: BacklogService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    if (this.data && this.data.backlogId) {
      this.getBacklogDetails(this.data.backlogId);
    }
  }

  getBacklogDetails(backlogId: number): void {
    this.backlogService.getBacklogById(backlogId).subscribe(
      (backlogData: any) => {
        this.backlog = backlogData;
        console.log('Détails du backlog récupérés avec succès :', this.backlog);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des détails du backlog :', error);
      }
    );
  }
  updateBacklog(): void {
    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour le backlog ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.backlog) {
          this.backlogService.updateBacklog(this.backlog.id, this.backlog).subscribe(
            (updatedBacklog: any) => {
              console.log('Backlog mis à jour avec succès :', updatedBacklog);
              this.toastr.success('Le backlog a été mis à jour avec succès!', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
              this.backlogUpdated.emit();
              this.dialogRef.close();
            },
            (error) => {
              console.error('Une erreur s\'est produite lors de la mise à jour du backlog :', error);
              this.toastr.error('Une erreur s\'est produite lors de la mise à jour du backlog.', 'Erreur', {
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
