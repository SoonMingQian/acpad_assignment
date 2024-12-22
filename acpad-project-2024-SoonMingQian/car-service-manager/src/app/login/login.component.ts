import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { UserRole } from '../services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class LoginComponent {
  showLogin = true;
  private fb = inject(FormBuilder)
  private loadingController = inject(LoadingController)
  private alertController = inject(AlertController)
  private authService = inject(AuthService)
  private router = inject(Router)

  registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['user' as UserRole]
  });

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get registerFirstName() {
    return this.registerForm.controls.firstName;
  }

  get registerLastName() {
    return this.registerForm.controls.lastName;
  }

  get registerEmail() {
    return this.registerForm.controls.email;
  }

  get registerPassword() {
    return this.registerForm.controls.password;
  }

  get loginEmail() {
    return this.loginForm.controls.email;
  }

  get loginPassword() {
    return this.loginForm.controls.password;
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      const result = await this.authService.register(this.registerForm.getRawValue());
      await loading.dismiss();
      if (result) {
        console.log('User registered:', result);
        await this.showSuccessAlert();
        this.showLogin = true;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Registration failed',
        message: (error as any).message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  private async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Registration successful! Please login.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      const result = await this.authService.login(this.loginForm.getRawValue());
      await loading.dismiss();
      if (result) {
        console.log('User logged in:', result);
        const role = result.role;
        if (role === 'manager') {
          this.router.navigateByUrl('/manager', { replaceUrl: true });
        } else if (role === 'mechanic') {
          this.router.navigateByUrl('/mechanic-appointment', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/tabs/cars', { replaceUrl: true });
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: (error as any).message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
