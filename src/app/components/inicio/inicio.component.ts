import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../utils/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: []
})
export class InicioComponent implements  OnInit {
  user = '';
  constructor(public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.user = localStorage.getItem('token');
  }


  logout(): void {
    this.authService.logout();
  }

}
