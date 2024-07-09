import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import {AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCompanyDialogComponent } from '../update-company-dialog/update-company-dialog.component';
import { Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'email', 'companyName', 'sector', 'size', 'phoneNumber', 'actions', 'validate', 'email_verified'];
  searchTerm: string = '';
  showSpinner: boolean = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator; // Assign the paginator
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }



  deleteCompany(companyId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cette entreprise ?',
      icon: 'warning',
      iconColor:'#ff0000',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ff0000'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.deleteCompany(Number(companyId)).subscribe(
          () => {
            Swal.fire('Supprimé !', 'L\'entreprise a été supprimée avec succès.', 'success');
            this.fetchCompanies();
          },
          (error) => {
            console.error('Error deleting company:', error);
            Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression de l\'entreprise.', 'error');
          }
        );
      }
    });

  }
  validateCompany(companyId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir valider cette entreprise ?',
      icon: 'info',
      iconColor: '#facc15',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner = true;
        this.companyService.validateCompany(companyId).subscribe(
          () => {
            const companyIndex = this.dataSource.data.findIndex(company => company.id === companyId);
            if (companyIndex !== -1) {
              this.dataSource.data[companyIndex].validate = true;
            }
            this.showSpinner = false;

            this.toastr.success('L\'entreprise a été validée avec succès', 'Validé');
            this.fetchCompanies();
          },
          (error) => {
            this.showSpinner = false;

            if (error.status === 403) {
              Swal.fire({
                icon: 'error',
                title: 'Validation impossible',
                text: 'L\'email n\est pas encore vérifé.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#facc15'
              });
            } else if (error.status === 400 && error.error === 'EmailNotVerifiedException') {
              Swal.fire({
                icon: 'error',
                title: 'Validation impossible',
                text: 'L\'email de cette entreprise n\'est pas encore vérifié.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#facc15'
              });
            } else {
              console.error('Error validating company:', error);
              this.toastr.error('Erreur lors de la validation de l\'entreprise', 'Erreur');
            }
          }
        );
      }
    });
  }






  invalidateCompany(companyId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir invalider cette entreprise ?',
      icon: 'warning',
      iconColor: '#facc15',
      showCancelButton: true,
      confirmButtonText: 'Oui, invalider',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.invalidateCompany(companyId).subscribe(
          () => {
            const companyIndex = this.dataSource.data.findIndex(company => company.id === companyId);
            if (companyIndex !== -1) {
              this.dataSource.data[companyIndex].validate = false;
            }
            this.toastr.success('L\'entreprise a été invalidée avec succès', 'Invalidé');
            this.fetchCompanies();
          },
          (error) => {
            console.error('Error invalidating company:', error);
            this.toastr.error('Erreur lors de l\'invalidation de l\'entreprise', 'Erreur');
          }
        );
      }
    });
  }



  toggleValidation(companyId: number): void {
    const company = this.dataSource.data.find(element => element.id === companyId);

    if (company) {
      if (company.validate) {
        this.invalidateCompany(companyId);
      } else {
        this.validateCompany(companyId);
      }
    }
  }









  openUpdateDialog(companyId: number): void {
    this.companyService.getCompanyDetails(companyId).subscribe(
      (companyData) => {
        const dialogRef = this.dialog.open(UpdateCompanyDialogComponent, {
          width: '700px',
          data: { ...companyData }
        });

        dialogRef.componentInstance.companyUpdated.subscribe(() => {
          this.fetchCompanies();
        });
      },
      (error) => {
        console.error('Error fetching company details:', error);
      }
    );
  }

  archiveCompany(companyId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir archiver cette entreprise ?',
      icon: 'warning',
      iconColor: '#facc15',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.archiveUser(companyId).subscribe(
          () => {
            this.toastr.success('L\'entreprise a été archivée avec succès', 'Archivé');
            this.fetchCompanies();
          },
          (error) => {
            console.error('Error archiving company:', error);
            this.toastr.error('Une erreur s\'est produite lors de l\'archivage de l\'entreprise', 'Erreur');
          }
        );
      }
    });
  }

  searchCompanies(): void {
    if (this.searchTerm.trim() !== '') {
      this.companyService.searchCompanys(this.searchTerm).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<any>(data);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error fetching companies:', error);
        }
      );
    } else {
      this.fetchCompanies();
    }
  }
}
