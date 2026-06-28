import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardPage implements OnInit, OnDestroy {
  ventasHoy = 0;
  totalProductos = 0;
  stockBajo = 0;
  mermaTotal = 0;
  private sub: Subscription = new Subscription();

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.cargarDashboard();
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('dashboard')) {
        this.cargarDashboard();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cargarDashboard() {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.ventasHoy = Number(data.ventasHoy);
        this.totalProductos = Number(data.totalProductos);
        this.stockBajo = Number(data.stockBajo);
        this.mermaTotal = Number(data.mermaTotal);
      },
      error: (error) => {
        console.log('Error cargando dashboard', error);
      }
    });
  }
}