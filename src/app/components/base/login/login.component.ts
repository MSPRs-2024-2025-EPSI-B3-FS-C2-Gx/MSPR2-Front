import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    NgClass
  ],
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private translate: TranslateService) {
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  // Récupère le message d'erreur pour un champ
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (!control || !control.errors || !this.submitted) return '';

    if (control.hasError('required')) {
      return this.translate.instant('VALIDATION.REQUIRED');
    } else if (control.hasError('email')) {
      return this.translate.instant('VALIDATION.INVALID_EMAIL');
    }

    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      // Faire défiler jusqu'au premier champ invalide
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.loading = true;
    const toastId = toast.loading(this.translate.instant('LOGIN.LOADING'));

    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    )
    .then(() => {
      toast.success(this.translate.instant('LOGIN.SUCCESS'), { id: toastId });
      this.router.navigate(['/client']);
    })
    .catch((error: Error) => {
      toast.error(this.translate.instant('LOGIN.ERROR.INVALID_CREDENTIALS'), { id: toastId });
    })
    .finally(() => {
      this.loading = false;
    });
  }
}
