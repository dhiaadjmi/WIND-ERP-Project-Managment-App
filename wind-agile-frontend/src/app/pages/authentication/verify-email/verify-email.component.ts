import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      const token = params['token'];
      this.authService.verifyEmail(email, token).subscribe(
        (response) => {
          console.log('Email vérifié avec succès:', response);

        },
        (error) => {
          console.error('Erreur lors de la vérification de l\'email:', error);
        }
      );
    });
  }
}
