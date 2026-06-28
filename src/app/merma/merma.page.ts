import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';

@Component({
  selector: 'app-merma',
  templateUrl: './merma.page.html',
  styleUrls: ['./merma.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MermaPage implements OnInit {

  mermaTotal = 0;
  productos: any[] = [];
  productosMerma: any[] = [];

  constructor(private api: Api) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarMerma();
  }

  ionViewWillEnter() {
    this.cargarProductos();
    this.cargarMerma();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data.map(p => ({ ...p, precio: Number(p.precio), stock: Number(p.stock) }));
      },
      error: (e) => console.log('Error', e)
    });
  }

  cargarMerma() {
    this.api.getMerma().subscribe({
      next: (data: any[]) => {
        this.productosMerma = data.map(item => ({
          ...item,
          perdida: Number(item.perdida),
          cantidad: Number(item.cantidad),
          estado: Number(item.perdida) >= 20 ? 'Alto' : 'Medio'
        }));
        this.mermaTotal = this.productosMerma.reduce((total, item) => total + Number(item.perdida), 0);
      },
      error: (e) => console.log('Error', e)
    });
  }

  registrarMerma() {
    if (this.productos.length === 0) {
      alert('Sin productos. Primero carga los productos.');
      return;
    }

    const lista = this.productos.map((p, i) => i + 1 + '. ' + p.nombre + ' (Stock: ' + p.stock + ')').join('\n');
    const seleccion = Number(prompt('Selecciona el numero del producto:\n' + lista));
    if (!seleccion || seleccion < 1 || seleccion > this.productos.length) return;

    const producto = this.productos[seleccion - 1];
    const motivo = prompt('Motivo (vencido, danado, roto):');
    if (!motivo) return;

    const cantidad = Number(prompt('Cantidad:'));
    if (!cantidad || cantidad <= 0) return;
    if (cantidad > producto.stock) { alert('Stock insuficiente.'); return; }

    const perdida = Number(prompt('Perdida en soles:'));
    if (!perdida || perdida <= 0) return;

    const nuevaMerma = {
      producto_id: producto.id,
      producto: producto.nombre,
      motivo,
      cantidad,
      perdida
    };

    this.api.registrarMerma(nuevaMerma).subscribe({
      next: () => {
        this.cargarMerma();
        this.cargarProductos();
        alert('Merma registrada correctamente.');
      },
      error: (e) => {
        console.log('Error', e);
        alert('Error al registrar la merma.');
      }
    });
  }

  eliminarMerma(index: number) {
    const merma = this.productosMerma[index];
    if (!confirm('Eliminar este registro de merma?')) return;
    this.api.eliminarMerma(merma.id).subscribe({
      next: () => this.cargarMerma(),
      error: (e) => console.log('Error', e)
    });
  }
}