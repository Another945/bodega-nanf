import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { Producto } from '../models/producto.model';

interface ItemCarrito extends Producto {
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VentasPage implements OnInit {

  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  busqueda: string = '';

  constructor(
    private api: Api,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data;
      },
      error: (error) => {
        console.log('Error cargando productos', error);
      }
    });
  }

  get productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  get total() {
    return this.carrito.reduce(
      (sum, item) => sum + Number(item.precio) * item.cantidad,
      0
    );
  }

  get cantidadTotal() {
    return this.carrito.reduce(
      (sum, item) => sum + item.cantidad,
      0
    );
  }

  agregar(producto: Producto) {
    if (producto.stock <= 0) {
      this.mostrarAlerta('Sin stock', 'Este producto ya no tiene stock disponible.');
      return;
    }

    const item = this.carrito.find(p => p.id === producto.id);

    if (item) {
      if (item.cantidad >= producto.stock) {
        this.mostrarAlerta('Stock insuficiente', 'No puedes agregar más unidades que el stock disponible.');
        return;
      }

      item.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  aumentar(item: ItemCarrito) {
    const producto = this.productos.find(p => p.id === item.id);

    if (producto && item.cantidad < producto.stock) {
      item.cantidad++;
    } else {
      this.mostrarAlerta('Stock insuficiente', 'No hay más unidades disponibles.');
    }
  }

  disminuir(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
    }
  }

  eliminar(id: number) {
    this.carrito = this.carrito.filter(item => item.id !== id);
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  async finalizarVenta() {
    if (this.carrito.length === 0) {
      await this.mostrarAlerta(
        'Carrito vacío',
        'Agrega productos antes de finalizar la venta.'
      );
      return;
    }

    const venta = {
      total: this.total,
      productos: this.carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: item.cantidad
      }))
    };

    this.api.registrarVenta(venta).subscribe({
      next: async () => {
        await this.mostrarAlerta(
          'Venta registrada',
          `Total vendido: S/ ${this.total.toFixed(2)}`
        );

        this.vaciarCarrito();
        this.cargarProductos();
      },
      error: async (error) => {
        console.log('Error registrando venta', error);

        await this.mostrarAlerta(
          'Error',
          'No se pudo registrar la venta.'
        );
      }
    });
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}