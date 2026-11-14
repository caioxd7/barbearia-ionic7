import {Routes} from '@angular/router';import {authGuard} from './guards/auth.guard';import {adminGuard} from './guards/admin.guard';
export const routes:Routes=[
{path:'',redirectTo:'login',pathMatch:'full'},
{path:'login',loadComponent:()=>import('./pages/login/login.page').then(m=>m.LoginPage)},
{path:'register',loadComponent:()=>import('./pages/register/register.page').then(m=>m.RegisterPage)},
{path:'home',canActivate:[authGuard],loadComponent:()=>import('./pages/home/home.page').then(m=>m.HomePage)},
{path:'services',canActivate:[authGuard],loadComponent:()=>import('./pages/services/services.page').then(m=>m.ServicesPage)},
{path:'barber/:id',canActivate:[authGuard],loadComponent:()=>import('./pages/barber/barber.page').then(m=>m.BarberPage)},
{path:'booking',canActivate:[authGuard],loadComponent:()=>import('./pages/booking/booking.page').then(m=>m.BookingPage)},
{path:'confirmed',canActivate:[authGuard],loadComponent:()=>import('./pages/confirmed/confirmed.page').then(m=>m.ConfirmedPage)},
{path:'history',canActivate:[authGuard],loadComponent:()=>import('./pages/history/history.page').then(m=>m.HistoryPage)},
{path:'profile',canActivate:[authGuard],loadComponent:()=>import('./pages/profile/profile.page').then(m=>m.ProfilePage)},
{path:'dashboard',canActivate:[adminGuard],loadComponent:()=>import('./pages/dashboard/dashboard.page').then(m=>m.DashboardPage)},
{path:'dashboard-access',canActivate:[authGuard],loadComponent:()=>import('./pages/dashboard-access/dashboard-access.page').then(m=>m.DashboardAccessPage)},
{path:'**',redirectTo:'home'}];