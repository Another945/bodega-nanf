import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class HomePage {

  usuario = '';
  password = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  async login() {

    const usuarioCorrecto = 'admin';
    const passwordCorrecto = '123';

    if (
      this.usuario === usuarioCorrecto &&
      this.password === passwordCorrecto
    ) {

      localStorage.setItem('logueado', 'true');

      this.router.navigate(['/tabs/dashboard']);

    } else {

      const alerta = await this.alertController.create({
        header: 'Acceso denegado',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['OK']
      });

      await alerta.present();
    }
  }
}