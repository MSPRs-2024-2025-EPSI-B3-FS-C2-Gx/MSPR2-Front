import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toast} from 'ngx-sonner';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TranslateModule
  ],
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

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

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      // Affiche une toast pour chaque champ invalide
      const controls = this.loginForm.controls;

      if (controls['email'].errors) {
        if (controls['email'].errors['required']) {
          toast.error(this.translate.instant('LOGIN.ERROR.NEED_EMAIL'));
        } else if (controls['email'].errors['email']) {
          toast.error(this.translate.instant('LOGIN.ERROR.INVALID_EMAIL'));
        }
      }

      if (controls['password'].errors) {
        toast.error(this.translate.instant('LOGIN.ERROR.NEED_PASSWORD'));
      }

      return;
    }

    this.loading = true;

    // Simule un appel API
    setTimeout(() => {
      this.loading = false;

      this.authService.login(this.loginForm.value.email).then(() => {
        toast.success(this.translate.instant('LOGIN.SUCCESS'));
        this.router.navigate(['/client']);
      });
    }, 1000);
  }
}
