import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, IonButton, IonContent],
  templateUrl: './dashboard-access.page.html',
  styleUrls: ['./dashboard-access.page.scss']
})
export class DashboardAccessPage {
  auth = inject(AuthService);
  reason = inject(ActivatedRoute).snapshot.queryParamMap.get('reason') || 'error';
}