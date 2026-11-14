import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, home, cutOutline, cut, timeOutline, time, personOutline, person } from 'ionicons/icons';

addIcons({ homeOutline, home, cutOutline, cut, timeOutline, time, personOutline, person });

/** Barra de navegação inferior (só visual): leva para as rotas que já existem. */
@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [RouterLink, IonIcon],
  template: `
    <nav class="tab-bar" aria-label="Navegação principal">
      <a routerLink="/home" [class.active]="active==='home'"><ion-icon [name]="active==='home'?'home':'home-outline'"></ion-icon>Início</a>
      <a routerLink="/services" [class.active]="active==='services'"><ion-icon [name]="active==='services'?'cut':'cut-outline'"></ion-icon>Agendar</a>
      <a routerLink="/history" [class.active]="active==='history'"><ion-icon [name]="active==='history'?'time':'time-outline'"></ion-icon>Histórico</a>
      <a routerLink="/profile" [class.active]="active==='profile'"><ion-icon [name]="active==='profile'?'person':'person-outline'"></ion-icon>Perfil</a>
    </nav>`
})
export class TabBarComponent { @Input() active: 'none' | 'home' | 'services' | 'history' | 'profile' = 'none'; }
