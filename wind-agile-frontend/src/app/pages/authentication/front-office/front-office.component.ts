import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.scss']
})
export class FrontOfficeComponent implements OnInit, OnDestroy {
  private styleUrls: string[] = [
    '../../../../assets/css/bootstrap.min.css',
    '../../../../assets/css/style.css',
  ];
  private styleElements: HTMLLinkElement[] = [];

  constructor(private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStyles();
  }

  ngOnDestroy() {
    this.unloadStyles();
  }

  private loadStyles() {
    const head = document.head;
    this.styleUrls.forEach(url => {
      const style = this.renderer.createElement('link');
      style.rel = 'stylesheet';
      style.href = url;
      this.renderer.appendChild(head, style);
      this.styleElements.push(style);
    });
  }

  private unloadStyles() {
    this.styleElements.forEach(style => {
      this.renderer.removeChild(document.head, style);
    });
  }
  goToLogin() {
    console.log('Lien de connexion cliqué');
    this.router.navigate(['/authentication/login']);
  }
  goToRegister() {
    console.log('Lien de connexion cliqué');
    this.router.navigate(['/authentication/register']);
  }
}
