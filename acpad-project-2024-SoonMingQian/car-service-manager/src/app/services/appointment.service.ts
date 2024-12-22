import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
// Used to create an observable that will emit the current value of the tasks array.
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export type AppointmentTitle = 'select' | 'repair' | 'service' | 'inspection'
export type AppointmentStatus = 'pending' | 'accepted' | 'cancelled' | 'completed'

export interface Appointment {
  id?: string;
  title: AppointmentTitle;
  description?: string;
  date: Date;
  status: AppointmentStatus;
  userId?: string;
  carId: string;
  mechanicId?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'mechanic' | 'manager';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private appointmentsCollection: CollectionReference;
  private appointments$: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);
  private appointmentsSub!: Subscription;

  constructor() {
    this.appointmentsCollection = collection(this.firestore, 'appointments') as CollectionReference;
    this.subscribeToAuthState();
  }
  private subscribeToAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.subscribeToAppointments(user.uid);
      } else {
        this.unsubscribeFromAppointments();
      }
    })
  }

  private subscribeToAppointments(userId: string): void {
    const q = query(this.appointmentsCollection, where('user', '==', userId));
    const appointments$ = collectionData(q, {
      idField: 'id',
    }).pipe(
      map(appointments => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment['date']) // Convert string date to Date object
      })))
    ) as Observable<Appointment[]>;
  
    this.appointmentsSub = appointments$.subscribe((appointments) => {
      this.appointments$.next(appointments);
    });
  }

  public subscribeToMechanicAppointments(mechanicId: string): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('mechanicId', '==', mechanicId));
    return collectionData(q, {
      idField: 'id',
    }).pipe(
      map(appointments => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment['date']) // Convert string date to Date object
      })))
    ) as Observable<Appointment[]>;
  }

 
  private unsubscribeFromAppointments(): void {
    this.appointments$.next([]);
    if (this.appointmentsSub) {
      this.appointmentsSub.unsubscribe();
    }
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined>  {
    const appointmentDocRef = doc(this.firestore, `appointments/${id}`);
    const docSnapshot = await getDoc(appointmentDocRef);
    const data = docSnapshot.data();
    if (data) {
      return {
        id: docSnapshot.id,
        ...data,
        date: new Date(data['date']) // Convert string date to Date object
      } as Appointment;
    } else {
      return undefined;
    }
  }

  async createAppointment(appointment: Appointment): Promise<void> {
    try{
      await addDoc(this.appointmentsCollection, {
        ...appointment,
        status: 'pending', // Default status
        user: this.auth.currentUser?.uid
      })
    } catch (error) {
      console.error('Error creating appointment', error);
    }
  }

  

  readAppointments() {
    return this.appointments$.asObservable();
  }
  
  readAllPendingAppointments(): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('status', '==', 'pending'));
    const appointments$ = collectionData(q, {
      idField: 'id',
    }).pipe(
      map(appointments => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment['date']) // Convert string date to Date object
      })))
    ) as Observable<Appointment[]>;
    return appointments$;
  }

  readAppointmentsByStatus(status: AppointmentStatus): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('status', '==', status));
    const appointments$ = collectionData(q, {
      idField: 'id',
    }).pipe(
      map(appointments => appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment['date']) // Convert string date to Date object
      })))
    ) as Observable<Appointment[]>;
    return appointments$;
  }

  updateAppointment(appointment: Appointment) {
    const ref = doc(this.firestore, `appointments/${appointment.id}`);
    return updateDoc(ref, { title: appointment.title, description: appointment.description, date: appointment.date, status: "pending" });
  }

  async deleteAppointment(appointment: Appointment) {
    try {
      const ref = doc(this.firestore, `appointments/${appointment.id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Error deleting appointment', error);
    }
  }

  async getMechanics(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('role', '==', 'mechanic'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  }

  async assignMechanic(appointmentId: string, mechanicId: string): Promise<void> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    await updateDoc(appointmentDoc, {
      mechanicId,
      status: 'accepted' // Automatically update the status to 'accepted'
    });
  }

  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<void> {
    try {
      const ref = doc(this.firestore, `appointments/${appointmentId}`);
      await updateDoc(ref, { status });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  private async getUserToken(userId: string): Promise<string | null> {
    const userDoc = await getDoc(doc(this.firestore, `users/${userId}`));
    return userDoc.exists() ? userDoc.data()['fcmToken'] : null;
  }
}


