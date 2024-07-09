import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  firstname: string;
  lastname: string;
  email: string;
  job: string;
  phoneNumber: string;
  cin: number;
  role: string;
  companyIdentifier: Number;
  showSpinner: boolean = false;


  constructor(private userService: UserService,
     private authService: AuthenticationService,
     private toastr: ToastrService,
     private router: Router,
    ) {
    this.companyIdentifier = this.authService.getUserId();
  }

  addUser(): void {
    const userData = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      job: this.job,
      phoneNumber: this.phoneNumber,
      cin: this.cin,
      role: this.role
    };

    if (this.companyIdentifier !== undefined) {
      this.showSpinner = true;

      this.userService.addUser(userData, this.companyIdentifier).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.toastr.success('L\'utilisateur a été ajouté avec succès', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
          this.router.navigateByUrl('/component/users');
          this.showSpinner = false;

        },
        (error) => {
          console.error('Error adding user:', error);
          this.toastr.error('Une erreur s\'est produite lors de l\'ajout de l\'utilisateur', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
          this.showSpinner = false;

        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }

}
