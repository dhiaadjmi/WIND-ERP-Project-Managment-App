import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
    <div class="text-center d-flex align-items-center justify-content-center">
  <a >
    <img src="./assets/images/logos/windlite.png"
    class="align-middle m-2"
    alt="logo"
    style="width: 100px; height: 100px;" />

  </a>

</div>

    </div>
  `,
})
export class BrandingComponent {

}

