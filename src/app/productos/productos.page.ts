import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProductosPage implements OnInit {
  productos: any[] = [];

  constructor(private api: Api) {}

  ngOnInit() { this.cargarProductos(); }
  ionViewWillEnter() { this.cargarProductos(); }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data.map(p => ({ ...p, precio: Number(p.precio), stock: Number(p.stock) }));
      },
      error: (e) => console.log('Error', e)
    });
  }

  agregarProducto() {
    const nombre = prompt('Nombre del producto:');
    if (!nombre) return;
    const descripcion = prompt('Descripcion:') || '';
    const precio = Number(prompt('Precio:') || 0);
    const stock = Number(prompt('Stock inicial:') || 0);
    const imagen = prompt('Emoji:') || '📦';
    this.api.crearProducto({ nombre, descripcion, precio, stock, imagen }).subscribe(() => this.cargarProductos());
  }

  editarProducto(producto: any) {
    const nombre = prompt('Nombre:', producto.nombre);
    if (!nombre) return;
    const descripcion = prompt('Descripcion:', producto.descripcion) || '';
    const precio = Number(prompt('Precio:', producto.precio) || producto.precio);
    const stock = Number(prompt('Stock:', producto.stock) || producto.stock);
    const imagen = prompt('Emoji:', producto.imagen) || producto.imagen;
    this.api.editarProducto(producto.id, { nombre, descripcion, precio, stock, imagen }).subscribe(() => this.cargarProductos());
  }

  reponerStock(producto: any) {
    const cantidad = Number(prompt('Cantidad a agregar:'));
    if (!cantidad || cantidad <= 0) return;
    this.api.reponerStock(producto.id, cantidad).subscribe(() => this.cargarProductos());
  }

  eliminarProducto(producto: any) {
    if (!confirm('Eliminar ' + producto.nombre + '?')) return;
    this.api.eliminarProducto(producto.id).subscribe(() => this.cargarProductos());
  }
}