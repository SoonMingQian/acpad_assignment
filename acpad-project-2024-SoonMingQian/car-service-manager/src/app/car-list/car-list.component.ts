import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserCarsService, Car } from '../services/user-cars.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonContent,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonButton
  ]
})
export class CarListComponent {
  cars$!: Observable<Car[]>;

  private authService = inject(AuthService);
  private userCarsService = inject(UserCarsService);
  private router = inject(Router);

  ngOnInit() {
    this.cars$ = this.userCarsService.readCars();
  }

  async viewCar(car: Car) {
    this.router.navigate(['tabs/cars/update', car.id]);
  }

  navigateToAddCar() {
    this.router.navigate(['tabs/cars/add']);
  }
}
