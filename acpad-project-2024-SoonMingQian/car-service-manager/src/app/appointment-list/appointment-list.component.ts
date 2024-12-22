import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment, AppointmentService } from '../services/appointment.service';
import { UserCarsService, Car } from '../services/user-cars.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton]
})
export class AppointmentListComponent {
  appointments$!: Observable<Appointment[]>;
  cars$!: Observable<Car[]>;

  private authService = inject(AuthService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private userCarsService = inject(UserCarsService);

  ngOnInit() {
    this.appointments$ = this.appointmentService.readAppointments();
    this.cars$ = this.userCarsService.readCars(); 
  }

  viewAppointment(appointment: Appointment) {
    if (appointment.id) {
      this.router.navigate(['tabs/appointments/update', appointment.id]);
    }
  }

  navigateToAddAppointment() {
    this.router.navigate(['tabs/appointments/add']);
  }

}
