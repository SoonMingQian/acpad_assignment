import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { managerAuthGuard } from './manager-auth.guard';
import { mechanicAuthGuard } from './mechanic-auth.guard';
import { TabsComponent } from './tabs/tabs.component';
import { ManagerTabsComponent } from './manager-tabs/manager-tabs.component';
import { AppointmentTabsComponent } from './appointment-tabs/appointment-tabs.component';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'mechanic-appointment',
    loadComponent: () => import('./mechanic-appointment/mechanic-appointment.component').then((m) => m.MechanicAppointmentComponent),
    canActivate: [mechanicAuthGuard]
  },
  {
    path: 'manager',
    component: ManagerTabsComponent,
    children: [
      {
        path: 'mechanic-register',
        loadComponent: () => import('./mechanic-register/mechanic-register.component').then(m => m.MechanicRegisterComponent),
        canActivate: [managerAuthGuard]
      },
      {
        path: 'appointments-tabs',
        component: AppointmentTabsComponent,
        children: [
          {
            path: 'pending',
            loadComponent: () => import('./appointment/appointment.component').then(m => m.AppointmentComponent),
            canActivate: [managerAuthGuard],
            data: { status: 'pending' }
          },
          {
            path: 'accepted',
            loadComponent: () => import('./appointment/appointment.component').then(m => m.AppointmentComponent),
            canActivate: [managerAuthGuard],
            data: { status: 'accepted' }
          },
          {
            path: 'completed',
            loadComponent: () => import('./appointment/appointment.component').then(m => m.AppointmentComponent),
            canActivate: [managerAuthGuard],
            data: { status: 'completed' }
          },
        ],
      },
      {
        path: 'assign-task',
        loadComponent: () => import('./assign-task/assign-task.component').then(m => m.AssignTaskComponent),
        canActivate: [managerAuthGuard]
      },
      {
        path: '',
        redirectTo: 'appointments-tabs/pending',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'questions',
        loadComponent: () => import('./question/question.component').then((m) => m.QuestionComponent),
        canActivate: [authGuard]
      },
      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('./appointment-list/appointment-list.component').then((m) => m.AppointmentListComponent),
            canActivate: [authGuard]
          },
          {
            path: 'add',
            loadComponent: () => import('./appointment-add/appointment-add.component').then((m) => m.AppointmentAddComponent),
            canActivate: [authGuard]
          },
          {
            path: 'update/:id',
            loadComponent: () => import('./appointment-update/appointment-update.component').then((m) => m.AppointmentUpdateComponent),
            canActivate: [authGuard]
          }
        ]
      },
      {
        path: 'cars',
        children: [
          {
            path: '',
            loadComponent: () => import('./car-list/car-list.component').then((m) => m.CarListComponent),
            canActivate: [authGuard]
          },
          {
            path: 'add',
            loadComponent: () => import('./car-add/car-add.component').then((m) => m.CarAddComponent),
            canActivate: [authGuard]
          },
          {
            path: 'update/:id',
            loadComponent: () => import('./car-update/car-update.component').then((m) => m.CarUpdateComponent),
            canActivate: [authGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/appointments',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
