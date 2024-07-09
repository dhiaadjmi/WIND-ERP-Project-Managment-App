import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class AppSideLoginComponent {
hidePassword: boolean = true;
email: string = '';
password: string = '';
errorMessage: string = '';
emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


constructor(private authService: AuthenticationService, private router: Router) {}
togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}
signIn(): void {
  if (!this.email || !this.password) {
    this.errorMessage = 'Veuillez saisir votre email et votre mot de passe.';
    return;
  }

  const credentials = { email: this.email, password: this.password };
  this.authService.signIn(credentials).subscribe(
    (response) => {
      const role = this.authService.getRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/component/admindashboard']);
      } else if (role === 'COMPANY') {
        this.router.navigate(['/component/companydashboard']);
      } else if (role === 'EMPLOYEE'){
        this.router.navigate(['/component/myhomepage']);
      }
      else if (role === 'LEADER'){
        this.router.navigate(['/component/myhomepage']);
      }

      else  {
        this.router.navigate(['/']);
      }
      console.log('Login successful', response);
    },
    (error) => {
      console.error('Login failed', error);
      if (error.status === 401 || error.status === 403) {
        this.errorMessage = 'Email ou mot de passe incorrect.';
      } else {
        this.errorMessage = 'Une erreur s\'est produite lors de la connexion.         email ou mots de passe incorrecte .';
      }
    }
  );
}

}
