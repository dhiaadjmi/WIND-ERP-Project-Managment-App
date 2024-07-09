import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email: string;

  isLoading: boolean = false;

  constructor(private authService: AuthenticationService) { }
/**
  resetPassword(): void {
    this.isLoading = true; // Activer l'indicateur de chargement

    this.authService.resetPassword(this.email).subscribe(
      () => {
        console.log('Reset password request sent successfully');
        Swal.fire('Success', 'Reset password request sent successfully', 'success');
      },
      (error) => {
        console.error('Error resetting password:', error);
        // Ne rien faire en cas d'erreur, car nous voulons afficher la boîte de dialogue de succès même en cas d'échec
      }
    ).add(() => {
      this.isLoading = false; // Désactiver l'indicateur de chargement après l'appel de l'API
    });
  }
*/
resetPassword(): void {
  this.isLoading = true; // Activer l'indicateur de chargement

  this.authService.resetPassword(this.email).subscribe(
    () => {
      console.log('Reset password request sent successfully');
      Swal.fire('Success', 'Reset password request sent successfully', 'success');
    },
    (error) => {
      console.error('Error resetting password:', error);
      Swal.fire('Success', 'Mots passe envoyé avec sucées ', 'success');
    }
  ).add(() => {
    this.isLoading = false;
  });
}


}
