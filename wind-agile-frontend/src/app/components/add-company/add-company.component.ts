import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {

  email: string;
  companyName: string;
  sector: string;
  size: string;
  phoneNumber: string;
  showSpinner: boolean = false;

  constructor(private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  addCompany(): void {
    this.showSpinner = true;

    const companyData = {
      email: this.email,
      companyName: this.companyName,
      sector: this.sector,
      size: this.size,
      phoneNumber: this.phoneNumber,
    };

    this.companyService.saveCompany(companyData).subscribe(
      (response) => {
        console.log('Company added successfully:', response);
        this.toastr.success('L\'entreprise a été ajoutée avec succès', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        this.router.navigateByUrl('/component/companies');
        this.showSpinner = false; // Masquage du spinner après la réussite de l'opération
      },
      (error) => {
        console.error('Error adding company:', error);
        this.toastr.error('Une erreur s\'est produite lors de l\'ajout de l\'entreprise', 'Erreur', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        this.showSpinner = false; // Masquage du spinner en cas d'erreur lors de l'opération
      }
    );
  }

}
