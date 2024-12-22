import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { personAdd, calendar, clipboard, logOut } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-manager-tabs',
  templateUrl: './manager-tabs.component.html',
  styleUrls: ['./manager-tabs.component.scss'],
  standalone: true,
  imports: [IonTabs, IonLabel, IonIcon, IonTabButton, IonTabBar]
})
export class ManagerTabsComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personAdd, calendar, clipboard, logOut });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}