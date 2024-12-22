import { Injectable, inject } from '@angular/core';
import {
  Auth, // Used to get the current user and subscribe to the auth state.
  createUserWithEmailAndPassword, // Used to create a user in Firebase auth.
  signInWithEmailAndPassword, // Used to sign in a user with email and password.
  signOut, // Used to sign out a user.
  UserCredential, // Used to get the user object from the login method.
  onAuthStateChanged // Used to subscribe to the auth state changes.
} from '@angular/fire/auth';
// Used to interact with Firestore databse. We store user info in Firestore.
import { doc, Firestore, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { PushNotifications } from '@capacitor/push-notifications';

export type UserRole = 'user' | 'mechanic' | 'manager';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inject the Auth and Firestore services. 
  private auth = inject(Auth); // Inject AngularFireAuth service. We need it to create a user in Firebase auth.
  private firestore = inject(Firestore);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.saveToken();
      }
    });
  }

  // Sign up with email/password. Creates user in Firebase auth and adds user info to Firestore database
  async register({ firstName, lastName, email, password, role }: { firstName: string, lastName: string, email: string, password: string, role: UserRole}): Promise<UserCredential | null> {
    try{
      // Only consist of email and password
      const currentUser = this.auth.currentUser;
      // checks if the role being assigned to the new user is "mechanic" and if there is a currently authenticated user.
      if (role === 'mechanic' && currentUser) {
        const currentUserDoc =  await getDoc(doc(this.firestore, `users/${currentUser.uid}`));
        const currentUserData = currentUserDoc.data() as User;
        // Checks if the currently authenticated user is a manager
        if (currentUserData.role !== 'manager') {
          console.error('Only managers can create mechanic accounts');
          return null;
        }
      }
      const credentials = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const ref = doc(this.firestore, `users/${credentials.user.uid}`);
      await setDoc(ref, { firstName, lastName, email, role });
      return credentials;
    } catch (error) {
      console.error("Error in register: ", error);
      return null;
    }
  }

  async login({ email, password }: {email: string, password: string}) {
    try{
        const credentials = await signInWithEmailAndPassword(
        this.auth,
        email, 
        password
      );
      const userDoc = await getDoc(doc(this.firestore, `users/${credentials.user.uid}`));
      const userData = userDoc.data() as User;
      localStorage.setItem('userId', credentials.user.uid);
      localStorage.setItem('userRole', userData.role);
      return { user: credentials, role: userData.role };
    } catch (error) {
      console.error("Error in login: ", error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole'); 
    signOut(this.auth);
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return { id: userId } as User; // Return a partial User object with only the ID
    }
    return null;
  }

  getCurrentState() {
    const userRole = localStorage.getItem('userRole');
    return userRole ? userRole : null
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  private async saveToken() {
    const token = await PushNotifications.getDeliveredNotifications();
    if (token) {
      const userRef = doc(this.firestore, `users/${this.auth.currentUser?.uid}`);
      await updateDoc(userRef, { fcmToken: token });
    }
  }
}
