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
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrls: ['./appointment-update.component.scss'],
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
export class AppointmentUpdateComponent {
  newAppointment!: Appointment;
  appointments$!: Observable<Appointment[]>;
  cars$!: Observable<Car[]>;
  currentDate: string;
  maxDate: string;

  private authService = inject(AuthService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private userCarsService = inject(UserCarsService);
  private activatedRoute = inject(ActivatedRoute);
  private alertController = inject(AlertController);

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
    const appointmentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (appointmentId) {
      this.appointmentService.getAppointmentById(appointmentId).then(appointment => {
        if (appointment) {
          this.newAppointment = appointment;
        } else {
          this.handleAppointmentNotFound();
        }
      }).catch(error => {
        console.error('Error fetching appointment:', error);
      });
    }
  }

  async handleAppointmentNotFound() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Appointment not found.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/tabs/appointments']);
  }

  async updateAppointment() {
    await this.appointmentService.updateAppointment(this.newAppointment);
    console.log('Appointment updated');
    this.router.navigate(['/tabs/appointments']);
  }

  deleteAppointment(appointment: Appointment) {
    console.log('delete appointment', appointment);
    this.appointmentService.deleteAppointment(appointment);
    this.router.navigate(['/tabs/appointments']);
  }
}
