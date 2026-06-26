import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
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

  constructor(
    private alertController: AlertController,
    private api: Api
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarMerma();
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

  cargarMerma() {
    this.api.getMerma().subscribe({
      next: (data: any[]) => {
        this.productosMerma = data.map(item => ({
          ...item,
          perdida: Number(item.perdida),
          cantidad: Number(item.cantidad),
          estado: Number(item.perdida) >= 20 ? 'Alto' : 'Medio'
        }));

        this.mermaTotal = this.productosMerma.reduce(
          (total, item) => total + Number(item.perdida),
          0
        );
      },
      error: (error) => {
        console.log('Error cargando merma', error);
      }
    });
  }

async registrarMerma() {

  if (this.productos.length === 0) {
    await this.mostrarMensaje(
      'Sin productos',
      'Primero deben cargarse los productos desde la base de datos.'
    );
    return;
  }

  const alertProducto = await this.alertController.create({
    header: 'Seleccionar producto',
    message: 'Elige el producto que tendrá merma.',
    inputs: this.productos.map(producto => ({
      name: 'producto',
      type: 'radio',
      label: `${producto.nombre} | Stock: ${producto.stock}`,
      value: producto.id
    })),
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Siguiente',
        handler: async (productoId) => {

          const producto = this.productos.find(
            p => p.id === Number(productoId)
          );

          if (!producto) {
            this.mostrarMensaje('Error', 'Debes seleccionar un producto.');
            return false;
          }

          await this.abrirFormularioMerma(producto);
          return true;
        }
      }
    ]
  });

  await alertProducto.present();
}

async abrirFormularioMerma(producto: any) {

  const alertDatos = await this.alertController.create({
    header: 'Datos de la merma',
    message: `Producto seleccionado: ${producto.nombre}`,
    inputs: [
      {
        name: 'motivo',
        type: 'text',
        placeholder: 'Motivo: vencido, dañado, roto'
      },
      {
        name: 'cantidad',
        type: 'number',
        placeholder: 'Cantidad'
      },
      {
        name: 'perdida',
        type: 'number',
        placeholder: 'Pérdida en soles'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Guardar',
        handler: (data) => {

          const cantidad = Number(data.cantidad);
          const perdida = Number(data.perdida);

          if (!data.motivo || cantidad <= 0 || perdida <= 0) {
            this.mostrarMensaje(
              'Campos inválidos',
              'Completa motivo, cantidad y pérdida correctamente.'
            );
            return false;
          }

          if (cantidad > producto.stock) {
            this.mostrarMensaje(
              'Stock insuficiente',
              'La cantidad supera el stock disponible.'
            );
            return false;
          }

          const nuevaMerma = {
            producto_id: producto.id,
            producto: producto.nombre,
            motivo: data.motivo,
            cantidad: cantidad,
            perdida: perdida
          };

          this.api.registrarMerma(nuevaMerma).subscribe({
            next: () => {
              this.cargarMerma();
              this.cargarProductos();

              this.mostrarMensaje(
                'Merma registrada',
                'La merma fue guardada y el stock fue descontado correctamente.'
              );
            },
            error: (error) => {
              console.log('Error registrando merma', error);
              this.mostrarMensaje('Error', 'No se pudo registrar la merma.');
            }
          });

          return true;
        }
      }
    ]
  });

  await alertDatos.present();
}

eliminarMerma(index: number) {
  const merma = this.productosMerma[index];

  this.api.eliminarMerma(merma.id).subscribe({
    next: () => {
      this.cargarMerma();
    },
    error: (error) => {
      console.log('Error eliminando merma', error);
    }
  });
}

async mostrarMensaje(header: string, message: string) {
  const alerta = await this.alertController.create({
    header,
    message,
    buttons: ['OK']
  });

  await alerta.present();
}
}