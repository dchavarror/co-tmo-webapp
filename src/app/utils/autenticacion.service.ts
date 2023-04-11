import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private router: Router) { }

  logout(): void {
    this.router.navigate(['/menu']);
    localStorage.setItem('indLogeado', 'false');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nit');
    localStorage.removeItem('razonSocial');
    localStorage.removeItem('codigoSegmento');
  }

}
