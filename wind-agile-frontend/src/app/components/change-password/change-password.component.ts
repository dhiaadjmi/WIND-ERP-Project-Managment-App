import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CompanyService } from '../../services/company.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmOldPassword: string = '';
  confirmPassword: string = '';
  userId: any;

  // Properties for password visibility
  hideOldPassword: boolean = true;
  hideConfirmOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private authService: AuthenticationService,
              private companyService: CompanyService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  togglePasswordVisibility(field: string): void {
    switch(field) {
      case 'oldPassword':
        this.hideOldPassword = !this.hideOldPassword;
        break;
      case 'confirmOldPassword':
        this.hideConfirmOldPassword = !this.hideConfirmOldPassword;
        break;
      case 'newPassword':
        this.hideNewPassword = !this.hideNewPassword;
        break;
      case 'confirmPassword':
        this.hideConfirmPassword = !this.hideConfirmPassword;
        break;
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword ||
        this.oldPassword !== this.confirmOldPassword ||
        !this.newPassword || !this.confirmPassword ||
        !this.oldPassword || !this.confirmOldPassword) {
      console.log('Les mots de passe ne correspondent pas ou l\'un des champs est vide.');
      this.toastr.error('Les mots de passe ne correspondent pas ou l\'un des champs est vide.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
      return;
    }

    const updatedCompanyData = {
      password: this.newPassword
    };

    this.companyService.updateCompany(this.userId, updatedCompanyData).subscribe(
      () => {
        console.log('Mot de passe mis à jour avec succès !');
        this.toastr.success('Votre mot de passe a été mis à jour avec succès !', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmOldPassword = '';
        this.confirmPassword = '';
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        this.toastr.error('Une erreur est survenue lors de la mise à jour de votre mot de passe.', 'Erreur', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
      }
    );
  }
}
