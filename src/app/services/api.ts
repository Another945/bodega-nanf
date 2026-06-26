import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Api {

private url = 'http://192.168.100.134:3000';

  constructor(private http: HttpClient) {}

  getProductos() {
    return this.http.get<any[]>(`${this.url}/productos`);
  }

  registrarVenta(data: any) {
    return this.http.post(`${this.url}/ventas`, data);
  }

  registrarMerma(data: any) {
    return this.http.post(`${this.url}/merma`, data);
  }

  getMerma() {
    return this.http.get<any[]>(`${this.url}/merma`);
  }

  eliminarMerma(id: number) {
    return this.http.delete(`${this.url}/merma/${id}`);
  }
getDashboard() {
  return this.http.get<any>(`${this.url}/dashboard`);
}
getReportes() {
  return this.http.get<any>(`${this.url}/reportes`);
}
getReportesCompleto() {
  return this.http.get<any>(`${this.url}/reportes-completo`);
}
crearProducto(data: any) {
  return this.http.post(`${this.url}/productos`, data);
}

editarProducto(id: number, data: any) {
  return this.http.put(`${this.url}/productos/${id}`, data);
}

eliminarProducto(id: number) {
  return this.http.delete(`${this.url}/productos/${id}`);
}

reponerStock(id: number, cantidad: number) {
  return this.http.put(`${this.url}/productos/${id}/reponer`, { cantidad });
}
}