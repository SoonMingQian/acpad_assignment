import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCarsService, Car } from '../services/user-cars.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CameraService } from '../services/camera.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
  IonBackButton,
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonImg,
    IonBackButton,
    IonButtons
  ]
})
export class CarAddComponent {
  newCar: Car = {
    model: '',
    carReg: '',
    photo: ''
  };
  photo: string | undefined;

  private authService = inject(AuthService);
  private router = inject(Router);
  private userCarsService = inject(UserCarsService);
  constructor(
    private cameraService: CameraService,
  ) {}
  async createCar() {
    if (!this.photo) {
      alert('Please upload or take a photo of the car.');
      return;
    }
    this.newCar.photo = this.photo;
    await this.userCarsService.createCar(this.newCar);
    this.router.navigate(['/tabs/cars']);
  }

  async takePicture() {
    try {
      this.photo = await this.cameraService.takePicture();
      console.log('Picture taken:', this.photo);
    } catch (error) {
      console.error('Camera error:', error);
    }
  }
}
