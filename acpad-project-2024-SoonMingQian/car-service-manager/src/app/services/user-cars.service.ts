import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
// Used to create an observable that will emit the current value of the tasks array.
import { BehaviorSubject, Observable, Subscription } from 'rxjs';


export interface Car {
  id?: string;
  model: string;
  carReg: string;
  userId?: string;
  photo?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserCarsService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Create a reference to the cars collection
  private carsCollection: CollectionReference;

  // Create a BehaviorSubject observable. This stores the current value of tasks and will emit its current value to any new subscribers immediately upon subscription
  private cars$: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);

  // Create a subscription to the tasks collection. This is a subscription to the collection in Firestore.
  private carsSub!: Subscription;

  constructor() {
    this.carsCollection = collection(this.firestore, 'cars') as CollectionReference;
    this.subscribeToAuthState();
  }

  private subscribeToAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.subscribeToCars(user.uid);
      } else {
        this.unsubscribeFromCars();
      }
    })
  }

  private subscribeToCars(userId: string): void {
    // Create a query to get all cars for the current user
    const q = query(this.carsCollection, where('user', '==', userId));

    // Create an observable of the cars collection
    const cars$ = collectionData(q, {
      idField: 'id', // Include the document ID in the emitted data, under the field name 'id'
    }) as Observable<Car[]>; // Cast the collectionData observable to an observable of type Car[]

    // Subscribing to an Observable. This is the process of connecting a consumer (usually a function) to the Observable.
    // When you subscribe to an Observable, you provide a function that will be called each time the Observable emits a new value. 
    // In this case, the function takes one argument, tasks, which will be the new value emitted by the Observable.
    this.carsSub = cars$.subscribe((cars) => {
      this.cars$.next(cars);
    });
  }

  private unsubscribeFromCars(): void {
    // Clear cars by emitting an empty array to the cars$ BehaviorSubject.
    this.cars$.next([]);
    // If there is a subscription to the cars  collection
    if (this.carsSub) {
      this.carsSub.unsubscribe();
    }
  }

  async getCarById(id: string) : Promise<Car | undefined> {
    const carDocRef = doc(this.firestore, `cars/${id}`);
    const docSnapshot = await getDoc(carDocRef);
    const data = docSnapshot.data();
    if (data) {
      return {
        id: docSnapshot.id,
        ...data 
      } as Car;
    } else {
      return undefined;
    }
  }

  async createCar(car: Car) {
    try {
      await addDoc(this.carsCollection, {
        ...car,
        user: this.auth.currentUser?.uid
      });
    } catch (error) {
      console.error('Error creating car:', error);
    }
  }

  // Return the tasks BehaviorSubject as an observable. This will allow us to subscribe to the cars array.
  // The async keyword is not needed here because we are not calling to firestore.
  readCars() {
    return this.cars$.asObservable();
  }

  updateCar(car: Car) {
    const ref = doc(this.firestore, `cars/${car.id}`);
    return updateDoc(ref, { model: car.model, carReg: car.carReg, photo: car.photo });
  }

  async deleteCar(car: Car) {
    try {
      const ref = doc(this.firestore, `cars/${car.id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  }

  

}
