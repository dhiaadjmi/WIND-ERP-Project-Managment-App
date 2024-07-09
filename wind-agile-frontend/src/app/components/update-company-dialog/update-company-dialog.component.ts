import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-company-dialog',
  templateUrl: './update-company-dialog.component.html',
  styleUrls: ['./update-company-dialog.component.scss']
})
export class UpdateCompanyDialogComponent {
  @Output() companyUpdated: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<UpdateCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private companyService: CompanyService ,
     private toastr: ToastrService ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    const updatedCompanyData = {
      id: this.data.id,
      email: this.data.email,
      companyName: this.data.companyName,
      sector: this.data.sector,
      size: this.data.size,
      phoneNumber: this.data.phoneNumber,
    };

    Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir mettre à jour cette entreprise ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#facc15',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.updateCompany(this.data.id, updatedCompanyData).subscribe(
          (response) => {
            console.log('Company updated successfully:', response);
            this.toastr.success('L\'entreprise a été mise à jour avec succès', 'Succès', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
            this.companyUpdated.emit();

            this.dialogRef.close();
          },
          (error) => {
            console.error('Error updating company:', error);
            this.toastr.error('Une erreur s\'est produite lors de la mise à jour de l\'entreprise', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          }
        );
      }
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
