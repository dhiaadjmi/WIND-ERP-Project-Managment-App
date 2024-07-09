import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import {  AuthenticationService} from '../../services/authentication.service';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['profileImage', 'id', 'firstname', 'lastname', 'email', 'job', 'phoneNumber', 'cin', 'role', 'actions'];
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUsersByCompany();
  }

  fetchUsersByCompany(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getAllUsersByCompany(companyIdentifier).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<any>(data.map((user: any) => {
            return {
              ...user,
              profileImageUrl: 'http://localhost:8060/images/' + user.profileImageUrl
            };
          }));

          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error fetching users by company:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }

 /**  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  */
/**
  fetchUsersByCompany(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getAllUsersByCompany(companyIdentifier).subscribe(
        (data) => {
          this.dataSource = data;
        },
        (error) => {
          console.error('Error fetching users by company:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }
  */
  /**fetchUsersByCompany(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getAllUsersByCompany(companyIdentifier).subscribe(
        (data) => {
          this.dataSource = data;

          const observables = data.map((user: any) => {
            return this.authService.getProfileImageUrl(user.id);
          });

          forkJoin(observables).subscribe(
            (imageUrls: string[]) => {
              const updatedData = data.map((user: any, index: number) => {
                return { ...user, profileImageUrl: imageUrls[index] };
              });
              this.dataSource = updatedData;
            },
            (error) => {
              console.error('Error fetching profile images:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching users by company:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }
  */




  deleteUser(userId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      icon: 'warning',
      iconColor: '#ff0000',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ff0000'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé avec succès.', 'success');
       this.fetchUsersByCompany();
          },
          (error) => {
            console.error('Error deleting user:', error);
            Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression de l\'utilisateur.', 'error');
          }
        );
      }
    });
  }
  openUpdateUserDialog(userId: number): void {
    this.userService.getUserDetails(userId).subscribe(
      (userData) => {
        const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
          width: '1000px',
          data: { ...userData }
        });

        dialogRef.componentInstance.userUpdated.subscribe(() => {
          this.fetchUsersByCompany();
        });
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  archiveUser(userId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir archiver cet utilisateur ?',
      icon: 'warning',
      iconColor: '#facc15',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.archiveUser(userId).subscribe(
          () => {
            this.toastr.success('L\'utilisateur a été archivé avec succès', 'Archivé');
            this.fetchUsersByCompany();
          },
          (error) => {
            console.error('Error archiving user:', error);
            this.toastr.error('Une erreur s\'est produite lors de l\'archivage de l\'utilisateur', 'Erreur');
          }
        );
      }
    });
  }

  searchUsers(): void {
    if (this.searchTerm.trim() !== '') {
      this.userService.searchUsers(this.searchTerm).subscribe(
        (data) => {
          const updatedData = data.map((user: any) => {
            return {
              ...user,
              profileImageUrl: 'http://localhost:8060/images/' + user.profileImageUrl
            };
          });
          this.dataSource = new MatTableDataSource<any>(updatedData);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      this.fetchUsersByCompany();
    }
  }

}
