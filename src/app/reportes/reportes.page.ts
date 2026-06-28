import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ReportesPage implements OnInit, AfterViewInit {

  ventasHoy = 0;
  ventasTotales = 0;
  mermaTotal = 0;

  historialVentas: any[] = [];
  productosVendidos: any[] = [];
  stockBajo: any[] = [];

  graficoVentas: any;
  graficoProductos: any;

  constructor(private api: Api) {}

  ngOnInit() {
    this.cargarReportes();
  }

  ngAfterViewInit() {}

  ionViewWillEnter() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.api.getReportesCompleto().subscribe({
      next: (data) => {
        this.ventasHoy = Number(data.ventasHoy);
        this.ventasTotales = Number(data.ventasTotales);
        this.mermaTotal = Number(data.mermaTotal);

        this.historialVentas = data.historialVentas || [];
        this.productosVendidos = data.productosVendidos || [];
        this.stockBajo = data.stockBajo || [];

        setTimeout(() => {
          this.crearGraficos();
        }, 300);
      },
      error: (error) => {
        console.log('Error cargando reportes', error);
      }
    });
  }

  crearGraficos() {
    if (this.graficoVentas) {
      this.graficoVentas.destroy();
    }

    if (this.graficoProductos) {
      this.graficoProductos.destroy();
    }

    this.graficoVentas = new Chart('graficoVentas', {
      type: 'doughnut',
      data: {
        labels: ['Ventas', 'Merma'],
        datasets: [{
          data: [this.ventasTotales, this.mermaTotal],
          backgroundColor: ['#2563eb', '#ef4444']
        }]
      }
    });

    this.graficoProductos = new Chart('graficoProductos', {
      type: 'bar',
      data: {
        labels: this.productosVendidos.map(p => p.nombre),
        datasets: [{
          label: 'Unidades vendidas',
          data: this.productosVendidos.map(p => Number(p.cantidad)),
          backgroundColor: '#10b981'
        }]
      }
    });
  }

exportarPDF() {
  const pdf = new jsPDF();

  // Fondo superior
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, 210, 35, 'F');

  // Título
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Reporte General - Bodega NANF', 12, 18);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Fecha
  const fecha = new Date().toLocaleString();

  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(10);
  pdf.text(`Generado: ${fecha}`, 12, 45);

  // Tarjetas resumen
  const cards = [
    ['Ventas Hoy', `S/ ${this.ventasHoy.toFixed(2)}`],
    ['Ventas Totales', `S/ ${this.ventasTotales.toFixed(2)}`],
    ['Merma', `S/ ${this.mermaTotal.toFixed(2)}`],
    ['Stock Bajo', `${this.stockBajo.length} productos`]
  ];

  let x = 12;
  let y = 55;

  cards.forEach((card, index) => {
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(x, y, 42, 25, 4, 4, 'F');

    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.text(card[0], x + 4, y + 8);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(card[1], x + 4, y + 18);

    x += 48;

    if (index === 3) {
      x = 12;
      y += 35;
    }
  });

  // Historial
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Historial de Ventas', 12, 100);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  let filaY = 112;

  this.historialVentas.slice(0, 8).forEach((venta) => {
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(12, filaY - 6, 185, 10, 2, 2, 'F');

    pdf.setTextColor(51, 65, 85);
    pdf.text(`Venta #${venta.id}`, 16, filaY);

    pdf.text(`S/ ${Number(venta.total).toFixed(2)}`, 160, filaY);

    filaY += 12;
  });

  // Productos vendidos
  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('Productos más vendidos', 12, filaY + 8);

  filaY += 20;

  this.productosVendidos.slice(0, 5).forEach((producto) => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);

    pdf.text(producto.nombre, 16, filaY);
    pdf.text(`${producto.cantidad} unidades`, 155, filaY);

    filaY += 10;
  });

  // Pie
  pdf.setFillColor(241, 245, 249);
  pdf.rect(0, 280, 210, 17, 'F');

  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(9);
  pdf.text('Bodega NANF | Reporte generado automáticamente desde el sistema', 12, 290);

  const pdfBlob = pdf.output('blob');
const url = URL.createObjectURL(pdfBlob);
window.open(url, '_blank');
}
}