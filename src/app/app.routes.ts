import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./productos/productos.page').then(m => m.ProductosPage),
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./ventas/ventas.page').then(m => m.VentasPage),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./reportes/reportes.page').then(m => m.ReportesPage),
      },
      {
        path: 'merma',
        loadComponent: () =>
          import('./merma/merma.page').then(m => m.MermaPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];