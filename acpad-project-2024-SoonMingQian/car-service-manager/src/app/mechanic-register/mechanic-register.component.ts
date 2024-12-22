import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mechanic-register',
  templateUrl: './mechanic-register.component.html',
  styleUrls: ['./mechanic-register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class MechanicRegisterComponent {

  private fb = inject(FormBuilder);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });


  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      const user = await this.authService.register({
        ...this.credentials.getRawValue(),
        role: 'mechanic'
      });
      await loading.dismiss();

      if (user) {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Mechanic account created successfully.',
          buttons: ['OK']
        });
        await alert.present();
        // Reset the form
        this.credentials.reset();
        // Redirect to the login page
        this.router.navigateByUrl('/login');
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
}
