import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserCarsService, Car } from '../services/user-cars.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { CameraService } from '../services/camera.service';
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
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.scss'],
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
export class CarUpdateComponent {

  newCar!: Car;
  cars$!: Observable<Car[]>;

  private authService = inject(AuthService);
  private userCarsService = inject(UserCarsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private alertController = inject(AlertController);
  private cameraService = inject(CameraService);

  ngOnInit() {
    const carId = this.activatedRoute.snapshot.paramMap.get('id');
    if (carId) {
      this.userCarsService.getCarById(carId).then(car => {
        if (car) {
          this.newCar = car;
        } else {
          this.handleCarNotFound();
        }
      }).catch(error => {
        console.error('Error getting car:', error);
      })
    }
  }

  async handleCarNotFound() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Car not found.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/tabs/cars']);
  }

  async updateCar() {
    await this.userCarsService.updateCar(this.newCar);
    console.log('Car updated:', this.newCar);
    this.router.navigate(['/tabs/cars']);
  }

  deleteCar(car: Car) {
    console.log('Deleting car:', car);
    this.userCarsService.deleteCar(car);
    this.router.navigate(['/tabs/cars']);
  }

  async takePicture() {
    try {
      const photo = await this.cameraService.takePicture();
      if (photo) {
        this.newCar.photo = photo;
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Error taking picture. Please try again.');
    }
  }
}
