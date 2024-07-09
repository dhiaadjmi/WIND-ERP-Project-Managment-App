import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { ProfileImageService } from 'src/app/services/profile-image.service';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  profileImageUrl: string | undefined;
  userId: any;
  userRole: string | null = null;
  username: any ;
  showUsername: boolean;
  companyName: string | undefined;

  constructor(public dialog: MatDialog,
     private authService: AuthenticationService,
     private router: Router,
     private profileImageService: ProfileImageService,
     private userService: UserService,
     private companyService: CompanyService
    ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadProfileImage();
    this.userRole = this.authService.getRole();
    this.loadUserTeams();
    console.log("role",this.userRole)
    this.profileImageService.profileImageUrl$.subscribe(imageUrl => {
      this.profileImageUrl = imageUrl;
    });

  }

  loadProfileImage(): void {
    if (this.userId) {
      this.authService.getProfileImageUrl(this.userId).subscribe(
        imageUrl => {
          this.profileImageUrl = imageUrl;
          console.log('Profile Image URL:', this.profileImageUrl);
        },
        error => console.log('Error:', error)
      );
    }
  }

  logout(): void {
    this.authService.logout();

  }
  redirectToProfile(): void {
    if (this.userRole === 'EMPLOYEE' || this.userRole === 'LEADER') {
      this.router.navigate(['/component/updateuserprofile']);
    } else if (this.userRole === 'COMPANY') {
      this.router.navigate(['/component/updateprofile']);
    }
  }





  loadUserTeams(): void {
    if (this.userRole === 'COMPANY') {
      console.log('Company ID:', this.userId);
      this.companyService.getCompanyDetails(this.userId).subscribe(company => {
        this.companyName = company.companyName;
        console.log('Company Name:', this.companyName);
      }, error => console.log('Error:', error));
    } else {
      this.userService.getUserDetails(this.userId).subscribe(user => {
        this.username = user.firstname + ' ' + user.lastname;
      });
    }
    this.showUsername = true;
  }


}
