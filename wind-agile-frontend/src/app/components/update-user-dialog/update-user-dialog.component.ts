import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.scss']
})
export class UpdateUserDialogComponent {
  @Output() userUpdated: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    const updatedUserData = {
      id: this.data.id,
      firstname: this.data.firstname,
      lastname: this.data.lastname,
      email: this.data.email,
      job: this.data.job,
      phoneNumber: this.data.phoneNumber,
      cin: this.data.cin,
      role: this.data.role,
    };

    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour cet utilisateur ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUser(this.data.id, updatedUserData).subscribe(
          (response) => {
            console.log('User updated successfully:', response);

            this.toastr.success('L\'utilisateur a été mis à jour avec succès', 'Succès', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
            this.userUpdated.emit();

            this.dialogRef.close();
          },
          (error) => {
            console.error('Error updating user:', error);

            this.toastr.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          }
        );
      }
    });
  }



}
