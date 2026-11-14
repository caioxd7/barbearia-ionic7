import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { IonButton, IonContent, IonText } from '@ionic/angular/standalone';
import Chart, { ChartConfiguration, registerables } from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

Chart.register(...registerables);

type DashboardAppointment = {
  serviceName?: string;
  barberName?: string;
  date?: string;
  price?: number;
};

@Component({
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, IonText],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements AfterViewInit, OnDestroy {
  @ViewChild('trendCanvas') private trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('serviceCanvas') private serviceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barberCanvas') private barberCanvas!: ElementRef<HTMLCanvasElement>;

  private data = inject(DataService);
  auth = inject(AuthService);
  appointments: DashboardAppointment[] = [];
  customerCount = 0;
  revenue = 0;
  loading = true;
  error = '';
  updatedAt: Date | null = null;
  private charts: Chart[] = [];

  ngAfterViewInit() {
    void this.refresh();
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  async refresh() {
    this.loading = true;
    this.error = '';
    this.destroyCharts();

    try {
      const result = await this.data.dashboardData();
      this.appointments = result.appointments as DashboardAppointment[];
      this.customerCount = result.users;
      this.revenue = this.appointments.reduce((total, appointment) => total + (Number(appointment.price) || 0), 0);
      this.updatedAt = new Date();
      this.renderCharts();
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
      this.error = code === 'permission-denied'
        ? 'Sem permissão para consultar os dados. Confira seu papel admin e as regras do Firestore.'
        : 'Não foi possível carregar o dashboard. Verifique a conexão com o Firebase.';
    } finally {
      this.loading = false;
    }
  }

  get averageTicket() {
    return this.appointments.length ? this.revenue / this.appointments.length : 0;
  }

  private renderCharts() {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
    const monthlyCounts = months.map((month) => this.appointments.filter((appointment) => {
      const date = this.appointmentDate(appointment);
      return date && date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    }).length);

    const serviceCounts = this.countBy('serviceName');
    const barberCounts = this.countBy('barberName');
    const chartText = '#c9c9c9';
    const grid = 'rgba(255, 255, 255, 0.08)';

    this.charts = [
      new Chart(this.trendCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: months.map((month) => month.toLocaleDateString('pt-BR', { month: 'short' })),
          datasets: [{ label: 'Agendamentos', data: monthlyCounts, borderColor: '#e11d2e', backgroundColor: 'rgba(225, 29, 46, 0.16)', fill: true, tension: 0.35 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: chartText }, grid: { color: grid } }, y: { beginAtZero: true, ticks: { precision: 0, color: chartText }, grid: { color: grid } } } }
      } as ChartConfiguration),
      new Chart(this.serviceCanvas.nativeElement, {
        type: 'doughnut',
        data: { labels: Object.keys(serviceCounts), datasets: [{ data: Object.values(serviceCounts), backgroundColor: ['#e11d2e', '#e8b547', '#55a6a0', '#7779a8', '#b8b8b8'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: chartText, padding: 16 } } } }
      } as ChartConfiguration),
      new Chart(this.barberCanvas.nativeElement, {
        type: 'bar',
        data: { labels: Object.keys(barberCounts), datasets: [{ label: 'Agendamentos', data: Object.values(barberCounts), backgroundColor: '#e8b547', borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0, color: chartText }, grid: { color: grid } }, y: { ticks: { color: chartText }, grid: { display: false } } } }
      } as ChartConfiguration)
    ];
  }

  private countBy(field: 'serviceName' | 'barberName') {
    return this.appointments.reduce<Record<string, number>>((counts, appointment) => {
      const label = appointment[field] || 'Não informado';
      counts[label] = (counts[label] || 0) + 1;
      return counts;
    }, {});
  }

  private appointmentDate(appointment: DashboardAppointment) {
    if (!appointment.date) return null;
    const date = new Date(`${appointment.date}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private destroyCharts() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }
}