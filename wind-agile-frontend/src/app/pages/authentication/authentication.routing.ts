import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { FrontOfficeComponent } from './front-office/front-office.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'verifyemail',
        component: VerifyEmailComponent,
      },
      {
        path: 'resetpassword',
        component: ResetPasswordComponent,
      },
      {
        path: 'front',
        component: FrontOfficeComponent,
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
    ],
  },
];
