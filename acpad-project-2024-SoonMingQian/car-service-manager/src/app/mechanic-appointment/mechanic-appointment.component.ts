import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { logOutOutline, constructOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mechanic-appointment',
  templateUrl: './mechanic-appointment.component.html',
  styleUrls: ['./mechanic-appointment.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MechanicAppointmentComponent implements OnInit {
  mechanicAppointments$!: Observable<Appointment[]>;
  acceptedAppointments$!: Observable<Appointment[]>;
  completedAppointments$!: Observable<Appointment[]>;
  selectedTab = 'accepted';
  acceptedCount$!: Observable<number>;
  completedCount$!: Observable<number>;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) { 
    addIcons({
      'log-out-outline': logOutOutline,
      'construct-outline': constructOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('Mechanic ID:', currentUser.id);
      this.mechanicAppointments$ = this.appointmentService.subscribeToMechanicAppointments(currentUser.id);
      
      this.acceptedAppointments$ = this.mechanicAppointments$.pipe(
        map(appointments => appointments.filter(app => app.status === 'accepted'))
      );
      
      this.completedAppointments$ = this.mechanicAppointments$.pipe(
        map(appointments => appointments.filter(app => app.status === 'completed'))
      );

      this.acceptedCount$ = this.acceptedAppointments$.pipe(
        map(appointments => appointments.length)
      );
      
      this.completedCount$ = this.completedAppointments$.pipe(
        map(appointments => appointments.length)
      );
    } else {
      console.error('Current user is not a mechanic or no authenticated user found');
    }
  }

  async completeAppointment(appointment: Appointment) {
    await this.appointmentService.updateAppointmentStatus(appointment.id!, 'completed');
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
  }
}