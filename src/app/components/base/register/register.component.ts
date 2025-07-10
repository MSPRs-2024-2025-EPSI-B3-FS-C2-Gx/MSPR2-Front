import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {toast} from 'ngx-sonner';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {
    // Initialisation du formulaire avec des validateurs
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Vérifie que les mots de passe correspondent
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if (passwordValue !== confirmPasswordValue) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        const errors = { ...confirmPassword.errors };
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  }

  // Récupère le message d'erreur pour un champ
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (!control || !control.errors || !this.submitted) return '';

    if (control.hasError('required')) {
      return this.translate.instant('VALIDATION.REQUIRED');
    } else if (control.hasError('email')) {
      return this.translate.instant('VALIDATION.INVALID_EMAIL');
    } else if (control.hasError('minlength')) {
      return this.translate.instant('VALIDATION.MIN_LENGTH', { min: control.getError('minlength').requiredLength });
    } else if (control.hasError('passwordMismatch')) {
      return this.translate.instant('VALIDATION.PASSWORD_MISMATCH');
    } else if (control.hasError('pattern')) {
      return this.translate.instant('VALIDATION.INVALID_PATTERN');
    }

    return '';
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.registerForm.controls; }

  // Soumission du formulaire
  onSubmit() {
    this.submitted = true;

    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });

    // Arrêtez-vous ici si le formulaire est invalide
    if (this.registerForm.invalid) {
      // Trouver le premier champ invalide et faire défiler jusqu'à lui
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Afficher un message d'erreur général
      const errorMessages = [];

      if (this.registerForm.hasError('passwordMismatch')) {
        errorMessages.push(this.translate.instant('VALIDATION.PASSWORD_MISMATCH'));
      }

      if (this.f['terms'].invalid) {
        errorMessages.push(this.translate.instant('VALIDATION.TERMS_REQUIRED'));
      }

      if (errorMessages.length > 0) {
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error(this.translate.instant('VALIDATION.FORM_INVALID'));
      }

      return;
    }

    const toastId = toast.loading(this.translate.instant('REGISTER.LOADING'));
    this.loading = true;

    this.authService.register(
      this.registerForm.value.email,
      this.registerForm.value.password
    )
      .then(() => {
        toast.success(this.translate.instant('REGISTER.SUCCESS'), { id: toastId });
        this.router.navigate(['/login']);
      })
      .catch(() => {
        toast.error(this.translate.instant('REGISTER.ERROR.ALREADY_REGISTERED'), { id: toastId });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
