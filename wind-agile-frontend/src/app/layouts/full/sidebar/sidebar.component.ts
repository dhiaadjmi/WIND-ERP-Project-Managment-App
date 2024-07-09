import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavItem } from './nav-item/nav-item';
import { AuthenticationService } from '../../../services/authentication.service';
import { NavService } from '../../../services/nav.service';
import { UserService } from 'src/app/services/user.service';
import { ProfileImageService } from 'src/app/services/profile-image.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  filteredNavItems: NavItem[] = [];
  userId: any;
  profileImageUrl: string | undefined;
  username: any;
  showUsername: boolean;
  companyName: string | undefined;
  userRole: string;

  constructor(
    public navService: NavService,
    private authService: AuthenticationService,
    private userService: UserService,
    private profileImageService: ProfileImageService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getRole();
    this.loadUserTeams();
    this.filteredNavItems = this.filterNavItemsByRole(navItems, this.userRole);
    this.loadProfileImage();
    this.showUsername = this.userRole !== 'ADMIN';
    this.profileImageService.profileImageUrl$.subscribe(imageUrl => {
      this.profileImageUrl = imageUrl;
    });
  }

  private filterNavItemsByRole(items: NavItem[], role: string): NavItem[] {
    if (!role) {
      return items.filter(item => !item.roles || item.roles.length === 0);
    }
    return items.filter(item => !item.roles || item.roles.includes(role));
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
