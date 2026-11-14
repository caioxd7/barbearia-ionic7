import '@angular/common/locales/global/pt';
import { LOCALE_ID } from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter,withComponentInputBinding} from '@angular/router';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

bootstrapApplication(AppComponent,{providers:[provideIonicAngular(),provideAnimations(),provideRouter(routes,withComponentInputBinding()),{provide:LOCALE_ID,useValue:'pt'}]});