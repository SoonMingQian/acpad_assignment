import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentComponent } from '../appointment/appointment.component';
import { hourglassOutline, checkmarkCircleOutline, flagOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-tabs',
  templateUrl: './appointment-tabs.component.html',
  styleUrls: ['./appointment-tabs.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, AppointmentComponent],
})
export class AppointmentTabsComponent implements OnInit {
  pendingCount: number = 0;
  acceptedCount: number = 0;
  completedCount: number = 0;

  constructor(private appointmentService: AppointmentService) {
    addIcons({ 
      hourglassOutline, 
      checkmarkCircleOutline, 
      flagOutline 
    });
  }

  ngOnInit() {
    this.appointmentService.readAppointmentsByStatus('pending').subscribe(appointments => {
      this.pendingCount = appointments.length;
    });

    this.appointmentService.readAppointmentsByStatus('accepted').subscribe(appointments => {
      this.acceptedCount = appointments.length;
    });

    this.appointmentService.readAppointmentsByStatus('completed').subscribe(appointments => {
      this.completedCount = appointments.length;
    });
  }
}