import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../../utils/autenticacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements  OnInit {

  razonSocial = '';
  indInicio:boolean =true;
  indInventario:boolean =false;
  indVentas:boolean =false;
  indGastos:boolean =false;
  indBuscar:boolean =false;
  constructor(public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.razonSocial = 'Bienvenido: ';
    this.razonSocial = this.razonSocial +  localStorage.getItem('razonSocial');
  }
   
  onClickInicio(){
    this.indInicio = true;
    this.indInventario = false;
    this.indVentas = false;
    this.indGastos = false;
    this.indBuscar = false;
  }

  onClickInventario(){
    this.indInventario = true;
    this.indInicio = false;
    this.indVentas = false;
    this.indGastos = false;
    this.indBuscar = false;
  }

  onClickVentas(){
    this.indVentas = true;
    this.indInicio = false;
    this.indInventario = false;
    this.indGastos = false;
    this.indBuscar = false;
  }

  onClickGastos(){
    this.indGastos = true;
    this.indInicio = false;
    this.indInventario = false;
    this.indVentas = false;
    this.indBuscar = false;
  }

  onClickBuscar(){
    this.indBuscar = true;
    this.indInicio = false;
    this.indInventario = false;
    this.indVentas = false;
    this.indGastos = false;
  }

  onClickCerrarSession(): void {
    this.authService.logout();
  }
}
