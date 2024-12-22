import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment, AppointmentService } from '../services/appointment.service';
import { UserCarsService, Car } from '../services/user-cars.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.scss'],
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
    IonTextarea,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonBackButton,
    IonButtons
  ]
})
export class AppointmentAddComponent {
  newAppointment: Appointment = {
    title: 'select',
    description: '',
    date: new Date(),
    status: 'pending',
    carId: ''
  };
  appointments$!: Observable<Appointment[]>;
  cars$!: Observable<Car[]>;
  currentDate: string;
  maxDate: string;

  private authService = inject(AuthService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private userCarsService = inject(UserCarsService);

  constructor() {
    const now = new Date();
    this.currentDate = now.toISOString(); // Set current date in ISO format

    // Calculate the max date (current year + 10)
    const maxYear = now.getFullYear() + 10;
    const maxDate = new Date(maxYear, 11, 31); // Set to December 31 of the max year
    this.maxDate = maxDate.toISOString();
  }

  ngOnInit() {
    this.cars$ = this.userCarsService.readCars();
  }

  async createAppointment() {
    try {
      await this.appointmentService.createAppointment(this.newAppointment);
      this.router.navigate(['/tabs/appointments']);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  }
}
