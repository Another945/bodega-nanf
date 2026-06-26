import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  productos: Producto[] = [

    { id:1, nombre:'Leche Gloria', descripcion:'Leche evaporada 400g', precio:4.50, stock:120, imagen:'🥛' },
    { id:2, nombre:'Pan Bimbo', descripcion:'Pan de molde familiar', precio:7.50, stock:40, imagen:'🍞' },
    { id:3, nombre:'Inca Kola', descripcion:'Gaseosa 500ml', precio:3.50, stock:60, imagen:'🥤' },
    { id:4, nombre:'Arroz Costeño', descripcion:'Arroz superior 1kg', precio:5.00, stock:85, imagen:'🍚' },
    { id:5, nombre:'Aceite Primor', descripcion:'Aceite vegetal 1L', precio:12.90, stock:25, imagen:'🛢️' },
    { id:6, nombre:'Azúcar Rubia', descripcion:'Azúcar rubia 1kg', precio:4.20, stock:70, imagen:'🍯' },
    { id:7, nombre:'Fideos Don Vittorio', descripcion:'Fideos spaghetti 500g', precio:3.80, stock:95, imagen:'🍝' },
    { id:8, nombre:'Atún Florida', descripcion:'Conserva de atún 170g', precio:6.50, stock:35, imagen:'🐟' },
    { id:9, nombre:'Huevos', descripcion:'Paquete x15 unidades', precio:11.00, stock:30, imagen:'🥚' },
    { id:10, nombre:'Café Altomayo', descripcion:'Café instantáneo 100g', precio:13.50, stock:18, imagen:'☕' },

    { id:11, nombre:'Galleta Casino', descripcion:'Galleta dulce personal', precio:1.50, stock:100, imagen:'🍪' },
    { id:12, nombre:'Papas Lays', descripcion:'Snack personal 45g', precio:2.80, stock:55, imagen:'🥔' },
    { id:13, nombre:'Chocolate Sublime', descripcion:'Chocolate personal', precio:2.00, stock:80, imagen:'🍫' },
    { id:14, nombre:'Yogurt Gloria', descripcion:'Yogurt botella 1L', precio:7.20, stock:22, imagen:'🥣' },
    { id:15, nombre:'Queso Edam', descripcion:'Queso tajado 250g', precio:9.50, stock:12, imagen:'🧀' },

    { id:16, nombre:'Agua San Luis', descripcion:'Agua mineral 625ml', precio:2.00, stock:90, imagen:'💧' },
    { id:17, nombre:'Coca Cola', descripcion:'Gaseosa 500ml', precio:3.80, stock:75, imagen:'🥤' },
    { id:18, nombre:'Frugos Durazno', descripcion:'Jugo personal 300ml', precio:2.50, stock:48, imagen:'🧃' },
    { id:19, nombre:'Sporade', descripcion:'Bebida rehidratante 500ml', precio:3.20, stock:44, imagen:'🥤' },
    { id:20, nombre:'Cifrut', descripcion:'Bebida cítrica 500ml', precio:2.00, stock:65, imagen:'🧃' },

    { id:21, nombre:'Detergente Bolívar', descripcion:'Detergente bolsa 800g', precio:7.90, stock:20, imagen:'🧼' },
    { id:22, nombre:'Lavavajilla Sapolio', descripcion:'Lavavajilla 500g', precio:4.80, stock:26, imagen:'🧽' },
    { id:23, nombre:'Lejía Clorox', descripcion:'Lejía 1L', precio:4.50, stock:32, imagen:'🧴' },
    { id:24, nombre:'Papel Higiénico Elite', descripcion:'Paquete x4 rollos', precio:8.90, stock:28, imagen:'🧻' },
    { id:25, nombre:'Jabón Protex', descripcion:'Jabón antibacterial', precio:3.50, stock:50, imagen:'🧼' },

    { id:26, nombre:'Sal de Mesa', descripcion:'Sal yodada 1kg', precio:2.00, stock:60, imagen:'🧂' },
    { id:27, nombre:'Lentejas', descripcion:'Lenteja bolsa 500g', precio:4.30, stock:33, imagen:'🫘' },
    { id:28, nombre:'Quinua', descripcion:'Quinua perlada 500g', precio:6.80, stock:24, imagen:'🌾' },
    { id:29, nombre:'Harina Blanca Flor', descripcion:'Harina preparada 1kg', precio:5.60, stock:38, imagen:'🌾' },
    { id:30, nombre:'Mantequilla Laive', descripcion:'Mantequilla 200g', precio:6.90, stock:16, imagen:'🧈' }

  ];

  getProductos() {
    return this.productos;
  }

}