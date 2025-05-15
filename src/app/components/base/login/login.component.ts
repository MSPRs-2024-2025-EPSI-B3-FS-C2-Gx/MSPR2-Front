import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toast} from 'ngx-sonner';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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
          toast.error('Adresse email obligatoire');
        } else if (controls['email'].errors['email']) {
          toast.error('Adresse email invalide');
        }
      }

      if (controls['password'].errors) {
        toast.error('Mot de passe obligatoire');
      }

      return;
    }

    this.loading = true;

    // Simule un appel API
    setTimeout(() => {
      this.loading = false;

      this.authService.login().then(() => {
        toast.success('Connexion réussie !');
        this.router.navigate(['/client']);
      });
    }, 1000);
  }
}
