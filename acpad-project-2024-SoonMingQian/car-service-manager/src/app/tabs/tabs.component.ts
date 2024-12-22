import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { car, calendar, chatbubbles, logOut } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabs, IonLabel, IonIcon, IonTabButton, IonTabBar]
})
export class TabsComponent  {

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ car, calendar, chatbubbles, logOut });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
