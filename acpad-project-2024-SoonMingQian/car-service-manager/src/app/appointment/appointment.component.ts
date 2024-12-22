import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentStatus, Appointment, AppointmentService } from '../services/appointment.service';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonLabel,
  IonList, 
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel
  ]
})
export class AppointmentComponent implements OnInit {
  appointments$!: Observable<Appointment[]>;
  status!: AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const status = this.route.snapshot.data['status'] as AppointmentStatus;
    this.appointments$ = this.appointmentService.readAppointmentsByStatus(status);
  }
}