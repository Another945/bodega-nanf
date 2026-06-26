import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
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

  constructor(
    private api: Api,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  ionViewWillEnter() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data.map(p => ({
          ...p,
          precio: Number(p.precio),
          stock: Number(p.stock)
        }));
      },
      error: (error) => {
        console.log('Error cargando productos', error);
      }
    });
  }

  async agregarProducto() {
    const alert = await this.alertController.create({
      header: 'Nuevo producto',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre' },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción' },
        { name: 'precio', type: 'number', placeholder: 'Precio' },
        { name: 'stock', type: 'number', placeholder: 'Stock inicial' },
        { name: 'imagen', type: 'text', placeholder: 'Emoji o imagen: 🥛' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const producto = {
              nombre: data.nombre,
              descripcion: data.descripcion,
              precio: Number(data.precio),
              stock: Number(data.stock),
              imagen: data.imagen || '📦'
            };

            this.api.crearProducto(producto).subscribe(() => {
              this.cargarProductos();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async editarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Editar producto',
      inputs: [
        { name: 'nombre', type: 'text', value: producto.nombre, placeholder: 'Nombre' },
        { name: 'descripcion', type: 'text', value: producto.descripcion, placeholder: 'Descripción' },
        { name: 'precio', type: 'number', value: producto.precio, placeholder: 'Precio' },
        { name: 'stock', type: 'number', value: producto.stock, placeholder: 'Stock' },
        { name: 'imagen', type: 'text', value: producto.imagen, placeholder: 'Emoji' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Actualizar',
          handler: (data) => {
            const actualizado = {
              nombre: data.nombre,
              descripcion: data.descripcion,
              precio: Number(data.precio),
              stock: Number(data.stock),
              imagen: data.imagen || '📦'
            };

            this.api.editarProducto(producto.id, actualizado).subscribe(() => {
              this.cargarProductos();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async reponerStock(producto: any) {
    const alert = await this.alertController.create({
      header: 'Reponer stock',
      message: `Producto: ${producto.nombre}`,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad a agregar'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Reponer',
          handler: (data) => {
            const cantidad = Number(data.cantidad);

            if (cantidad <= 0) {
              return false;
            }

            this.api.reponerStock(producto.id, cantidad).subscribe(() => {
              this.cargarProductos();
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Deseas eliminar ${producto.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.eliminarProducto(producto.id).subscribe(() => {
              this.cargarProductos();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}