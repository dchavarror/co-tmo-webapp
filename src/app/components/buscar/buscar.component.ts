import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { InventarioService } from '../../services/inventario.service';
import { Venta } from '../../domain/venta';
import { DetalleProducto } from '../../domain/detalle.producto';
import { Producto } from '../../domain/producto';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  listaVentas: Venta[] = [];
  listaInventarios: DetalleProducto[] = [];
  indVentas: boolean;
  indInv: boolean;
  producto: Producto = new Producto();
  busquedaForm: FormGroup;
  message: string;
  indValidacion: boolean;
  totalConGanan = 0;
  totalSinGanan = 0;
  listaTmpPagiVen: Venta[] = [];
  listaTmpPagiInv: DetalleProducto[] = [];
  listaNumPag: String[] = [];
  page = 1;
  tableSize = environment.TABLE_SIZE;
  tableSizes = environment.TABLE_SIZES;
  count = 0;

  constructor(private ventaServices: VentaService,
    private inventarioServices: InventarioService,
    private fb: FormBuilder,
    private router: Router) {
      this.indVentas = false;
      this.indInv = false;
      this.listaNumPag[0] = '1';
      this.listaNumPag[1] = '2';
      this.listaNumPag[2] = '3';
      this.listaNumPag[3] = '4';
    }

  ngOnInit() {
    this.producto.usuario.nombre =  localStorage.getItem('usuario');
    this.producto.usuario.empresa.nit = localStorage.getItem('nit');
    this.producto.usuario.empresa.razonSocial = localStorage.getItem('razonSocial');
    this.producto.usuario.codigoSegmento = Number(localStorage.getItem('codigoSegmento'));
    this.inicializarComponentes();
  }

  inicializarComponentes(){
    this.busquedaForm = this.fb.group({
      fecInicio: new FormControl(),
      fecFin:  new FormControl(),

    });
  }

  get obtenerBusquedaForm() { return this.busquedaForm.controls; }

  getInventario() {
    if (!this.validarCampos()) {
        this.message = '';
        this.indValidacion = false;
        this.producto.fecInicio =  this.obtenerBusquedaForm.fecInicio.value;
        this.producto.fecFin = this.obtenerBusquedaForm.fecFin.value;
        this.indVentas = false;
        this.indInv = true;
        this.inventarioServices.obtenerInventario(this.producto).subscribe(inventarios => {
          this.listaInventarios = inventarios;
          this.inicializarComponentes();
		      this.sumarInventario();
        });
    }
  }
  
  sumarInventario() {
	  this.totalConGanan  = 0;
	  this.totalSinGanan  = 0;
	  for(let i = 0; i < this.listaInventarios.length ;i++){
		  let precioConGana = this.listaInventarios[i].precioFinal * this.listaInventarios[i].cantidad;
		  let precioSinGana = this.listaInventarios[i].precioUnitario * this.listaInventarios[i].cantidad;
		  this.totalConGanan = this.totalConGanan + precioConGana;
		  this.totalSinGanan = this.totalSinGanan + precioSinGana;
	  }
  }
  
  sumarVentas() {
	  this.totalConGanan  = 0;
	  for(let i = 0; i < this.listaVentas.length ;i++){
		  this.totalConGanan = this.totalConGanan + this.listaVentas[i].valorTotal;
	  }
  }
  getVentas() {
    if (!this.validarCampos()) {
        this.message = '';
        this.indValidacion = false;
        this.producto.fecInicio =  this.obtenerBusquedaForm.fecInicio.value;
        this.producto.fecFin = this.obtenerBusquedaForm.fecFin.value;
        this.indVentas = true;
        this.indInv = false;
        this.ventaServices.obtenerVenta(this.producto).subscribe(ventas => {
          this.listaVentas = ventas;
          this.inicializarComponentes();
		  this.sumarVentas();
        });
    }
  }

  validarCampos(): boolean {
    this.message = '';
    this.indValidacion = false;
    if (this.obtenerBusquedaForm.fecInicio.value == null || this.obtenerBusquedaForm.fecInicio.value === ''){
      this.message = 'Por favor debe ingresar las fechas';
      this.indValidacion = true;
    }
    if(this.obtenerBusquedaForm.fecFin.value == null || this.obtenerBusquedaForm.fecFin.value === ''){
       this.message = 'Por favor debe ingresar las fechas';
       this.indValidacion = true;
    }

    return this.indValidacion;
  }
  volverInicio(){
    this.router.navigate( ['home']);
  }

  paginarVenta(){
  }

  paginarInventario(){
  }

  onTableDataChangeVenta(event){
    this.page = event;
    //this.getVentas();
  }  

  onTableSizeChangeVenta(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    //this.getVentas();
  }  

  onTableDataChangeInventario(event){
    this.page = event;
    //this.getInventario();
  }  

  onTableSizeChangeInventario(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    //this.getInventario();
  } 

}
