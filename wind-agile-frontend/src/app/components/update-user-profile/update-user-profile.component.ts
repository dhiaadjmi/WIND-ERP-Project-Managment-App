import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ProfileImageService } from 'src/app/services/profile-image.service';
@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent {

  firstname: string = '';
  lastname: string = '';
  job:string = '';
  phoneNumber:string ='';
  cin:number ;



  selectedFile: File | null = null;
  profileImageUrl: string | undefined;
  userId: any;
  userRole:string;

  constructor(private authService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
    private profileImageService: ProfileImageService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getRole();
    this.loadProfileImage();
    if (this.userId) {
      this.userService.getUserDetails(this.userId).subscribe(
        (userDetails: any) => {
          this.firstname = userDetails.firstname;
          this.lastname = userDetails.lastname;
          this.job=userDetails.job;
          this.phoneNumber=userDetails.phoneNumber;
          this.cin=userDetails.cin;

        },
        error => console.log('Error:', error)
      );
    }
  }

/**   updateProfile(): void {
    if (!this.companyName || !this.sector) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  }
  */

  loadProfileImage(): void {
    if (this.userId) {
      this.authService.getProfileImageUrl(this.userId).subscribe(
        imageUrl => {
          this.profileImageUrl = imageUrl;
        },
        error => console.log('Error:', error)
      );
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.loadSelectedImage();
  }

  loadSelectedImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImageUrl = event.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


  uploadProfileImage() {
    if (this.selectedFile && this.userId) {
      this.authService.uploadProfileImage(this.selectedFile, this.userId)
        .subscribe(
          response => {
            console.log('Image upload successful:', response);
            this.loadProfileImage();
            this.updateCompany();

            this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          },
          error => {
            console.error('Image upload failed:', error);
            this.toastr.error('Une erreur est survenue lors de la mise à jour de votre profil.', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          }
        );
    } else {
      this.updateCompany();
      this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    }
  }


  updateCompany(): void {
    const updatedUserData = {
      firstname: this.firstname ,
      lastname: this.lastname ,
      job: this.job,
      phoneNumber: this.phoneNumber,
     cin: this.cin,

    };

    this.userService.updateUser(this.userId, updatedUserData).subscribe(
      (response) => {
        console.log('Company update successful:', response);
      },
      (error) => {
        console.error('Company update failed:', error);
      }
    );
  }

  updateProfileAndCompany(): void {
    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour votre profil et votre entreprise ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedFile && this.userId) {
          this.authService.uploadProfileImage(this.selectedFile, this.userId).subscribe(
            (response) => {
              console.log('Image upload successful:', response);
              this.loadProfileImage();
              this.updateCompany();

              // Mettre à jour l'image de profil dans le service ProfileImageService
              if (this.profileImageUrl) {
                this.profileImageService.setProfileImageUrl(this.profileImageUrl);
              }

              this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            },
            (error) => {
              console.error('Image upload failed:', error);
              this.toastr.error('Une erreur est survenue lors de la mise à jour de votre profil.', 'Erreur', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            }
          );
        } else {
          this.updateCompany();

          if (this.profileImageUrl) {
            this.profileImageService.setProfileImageUrl(this.profileImageUrl);
          }

          this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true
          });
        }
      }
    });
  }




}

