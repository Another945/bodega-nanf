import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardPage implements OnInit {

  ventasHoy = 0;
  totalProductos = 0;
  stockBajo = 0;
  mermaTotal = 0;

  constructor(private api: Api) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  ionViewWillEnter() {
    this.cargarDashboard();
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