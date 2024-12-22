import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment, User } from '../services/appointment.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.scss'],
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
    IonSelect,
    IonSelectOption
  ]
})
export class AssignTaskComponent  implements OnInit {
  appointments$!: Observable<Appointment[]>;
  mechanics: User[] = [];
  selectedAppointmentId: string | undefined;
  selectedMechanicId: string | undefined;

  constructor(private appointmentService: AppointmentService) {}

  async loadMechanics() {
    this.mechanics = await this.appointmentService.getMechanics();
  }

  ngOnInit() {
    this.appointments$ = this.appointmentService.readAllPendingAppointments();
    this.loadMechanics();
  }

  async assignMechanic() {
    if (this.selectedAppointmentId && this.selectedMechanicId) {
      const selectedMechanic = this.mechanics.find(m => m.id === this.selectedMechanicId);
      if (selectedMechanic) {
        await this.appointmentService.assignMechanic(this.selectedAppointmentId, selectedMechanic.id);
        alert('Mechanic assigned successfully and status updated to accepted');
      }
    }
  }
}
