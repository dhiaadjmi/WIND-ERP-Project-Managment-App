import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { EmailVerificationService } from 'src/app/services/email-verification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class AppSideRegisterComponent implements OnInit {
  registerForm: FormGroup;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService,
    private emailVerificationService: EmailVerificationService,

  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      sector: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      size: ['', [Validators.required, Validators.min(1)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?\\d{8,15}$')]]
    });

    this.registerForm.get('email')?.valueChanges.subscribe((value) => {
      this.checkEmail();
    });
  }



  checkEmail(): void {
    const email = this.registerForm.get('email')?.value;
    if (email) {
      this.emailVerificationService.checkEmailExists(email).subscribe(
        (exists) => {
          this.emailExists = exists;
          if (this.emailExists) {
            this.registerForm.get('email')?.setErrors({ 'emailExists': true });
          } else {
            this.registerForm.get('email')?.setErrors(null);
          }
        },
        (error) => {
          console.error('Error checking email:', error);
        }
      );
    }
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs correctement.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
      return;
    }

    const companyData = this.registerForm.value;

    this.companyService.saveCompany(companyData).subscribe(
      (response) => {
        console.log('Company added successfully:', response);
        this.toastr.success('L\'entreprise a été ajoutée avec succès', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
        this.router.navigate(['/authentication/login']);
      },
      (error) => {
        console.error('Error adding company:', error);
        this.toastr.error('Une erreur s\'est produite lors de l\'ajout de l\'entreprise', 'Erreur', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
      }
    );
  }
}
