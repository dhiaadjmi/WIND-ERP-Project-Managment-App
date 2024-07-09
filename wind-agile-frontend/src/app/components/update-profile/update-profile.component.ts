import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CompanyService } from '../../services/company.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ProfileImageService } from 'src/app/services/profile-image.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  companyName: string = '';
  sector: string = '';
  size:number;
  phoneNumber:string ='';


  selectedFile: File | null = null;
  profileImageUrl: string | undefined;
  userId: any;

  constructor(private authService: AuthenticationService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private profileImageService: ProfileImageService


  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadProfileImage();
    if (this.userId) {
      this.companyService.getCompanyDetails(this.userId).subscribe(
        (companyDetails: any) => {
          this.companyName = companyDetails.companyName;
          console.log(this.companyName)
          this.sector = companyDetails.sector;
          this.size=companyDetails.size;
          this.phoneNumber=companyDetails.phoneNumber;
        },
        error => console.log('Error:', error)
      );
    }
  }

  updateProfile(): void {
    if (!this.companyName || !this.sector) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  }

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
          },
          error => {
            console.error('Image upload failed:', error);
          }
        );
    }
  }

  updateCompany(): void {
    const updatedCompanyData = {
      companyName: this.companyName,
      sector: this.sector,
      size: this.size,
      phoneNumber: this.phoneNumber,

    };

    this.companyService.updateCompany(this.userId, updatedCompanyData).subscribe(
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
      text: 'Êtes-vous sûr de vouloir mettre à jour votre profil ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedFile && this.userId) {
          this.authService.uploadProfileImage(this.selectedFile, this.userId).subscribe(
            (response) => {
              console.log('Image upload successful:', response);
              if (this.profileImageUrl) {
                this.profileImageService.setProfileImageUrl(this.profileImageUrl);
              }
              this.loadProfileImage();
              this.updateCompany();
              this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
            },
            (error) => {
              console.error('Image upload failed:', error);
              this.toastr.error('Une erreur est survenue lors de la mise à jour de votre profil.', 'Erreur', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
            }
          );
        } else {
          this.updateCompany();
          this.toastr.success('Votre profil a été mis à jour avec succès !', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
        }
      }
    });
  }


}
