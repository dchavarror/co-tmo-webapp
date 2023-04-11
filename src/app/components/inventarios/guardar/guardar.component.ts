import { Component, OnInit, NgModule, PipeTransform, Pipe, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../domain/producto';
import { NumberFormatPipe } from '../../../pipes/numberformat.pipe';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Respuesta } from '../../../domain/respuesta';
import { DetalleProducto } from '../../../domain/detalle.producto';
import { InventarioService } from '../../../services/inventario.service';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/domain/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { Segmento } from '../../../domain/segmento';
import { GenericoService } from '../../../services/generico.service';
import { TipoGenerico } from '../../../domain/tipoGenerico';
import { environment } from '../../../../environments/environment';
import { UnidadService } from '../../../services/unidad.service';
import { Unidad } from '../../../domain/unidad';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-guardar',
  templateUrl: './guardar.component.html',
  styleUrls: ['./guardar.component.css']
})
export class GuardarComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaCategorias: Categoria[] = [];
  listaUnidades: TipoGenerico[] = [];
  categoria = new Categoria();
  unidad = new Unidad();
  segmento = new Segmento();

  guardarProForm: FormGroup;
  guarCategoriaForm: FormGroup;
  invForm: FormGroup;
  guarUnidForm: FormGroup;

  producto: Producto = new Producto();
  loading: boolean;
  modalgp = 'none';
  modalgc = 'none';
  modalgu = 'none';
  modalres = 'none';
  modalconf = 'none';
  respuesta: Respuesta = new Respuesta();
  detalleProducto: DetalleProducto = new DetalleProducto();
  indRespuesta = false;
  descripcionRes: String;
  TIPO_RESPUESTA_OK = 'OK';
  message: string;
  indValidacion: boolean;
  indVisibleMessa: boolean;
  tipoUnidad: TipoGenerico;


  constructor(private productoServices: ProductoService,
    private numberFormatPipe: NumberFormatPipe,
    private fb: FormBuilder,
    private categoriaServices: CategoriaService,
    private inventarioServices: InventarioService,
    private unidadService: UnidadService,
    private router: Router) {
      this.loading = true;
      this.asignarValoresVariables();
      this.getCategorias();
  }

  asignarValoresVariables() {
    this.producto.usuario.nombre =  localStorage.getItem('usuario');
    this.producto.usuario.empresa.nit = localStorage.getItem('nit');
    this.producto.usuario.empresa.razonSocial = localStorage.getItem('razonSocial');
    this.producto.usuario.codigoSegmento = Number(localStorage.getItem('codigoSegmento'));
    this.segmento.codigo = this.producto.usuario.codigoSegmento;
    this.detalleProducto.usuario.nombre =  this.producto.usuario.nombre ;
    this.detalleProducto.usuario.empresa.nit  = this.producto.usuario.empresa.nit;
    this.detalleProducto.usuario.empresa.razonSocial = this.producto.usuario.empresa.razonSocial;
  }
  ngOnInit() {
    this.inicializarComponentesInv();
    this.inicializarComponentesGuarCat();
    this.inicializarComponenteGP();
    this.inicializarComponentesGuarUni();
  }

  inicializarComponentesInv() {
     this.invForm = this.fb.group({
      scategoriai: new FormControl(),
      sproducto:  new FormControl(),
      punitario: new FormControl(),
      pganancia:  new FormControl(),
      pfinal: new FormControl(),
      cantidad:  new FormControl(),
      sunidad: new FormControl(),
      codBarras: new FormControl(),
    });
  }

  inicializarComponenteGP(){
    this.guardarProForm = this.fb.group({
      scategoria: new FormControl(),
      descProducto:  new FormControl(),
      codBarras: new FormControl(),

    });
  }

  inicializarComponentesGuarCat() {
    this.guarCategoriaForm = this.fb.group({
      descripcionCategoria: new FormControl(),
    });
  }
  inicializarComponentesGuarUni() {
    this.guarUnidForm = this.fb.group({
      descripcionUnidad: new FormControl(),
      scategoriau: new FormControl(),
    });
  }
   get obtenerGuardarProForm() { return this.guardarProForm.controls; }
   get obtenerInvForm() { return this.invForm.controls; }
   get obtenerFormGuarCate() { return this.guarCategoriaForm.controls; }
   get obtenerFormGuarUnid() { return this.guarUnidForm.controls; }

  getProductos() {
    this.productoServices.obtenerProducto(this.producto).subscribe(productos => {
      this.listaProductos = productos;
    });
    this.loading = false;
  }

  getTipoUnidades() {
    this.unidadService.obtenerUnidades(Number(this.categoria.codigo)).subscribe(unidades => {
      this.listaUnidades = unidades;
    });
    this.loading = false;
  }

  getCategorias() {
    this.categoriaServices.obtenerCategorias(this.segmento.codigo).subscribe(categorias => {
      this.listaCategorias = categorias;
    });
  }

  guardarCategoria() {
    if (this.validarGuardarCategoria()) {
        this.hidePopupGC();
        this.categoria.codigoSegmento = this.segmento.codigo;
        this.categoria.descripcion = this.obtenerFormGuarCate.descripcionCategoria.value;
        this.categoriaServices.guardarCategoria(this.categoria).subscribe(respuesta => {
          this.respuesta = respuesta;
          this.descripcionRes = this.respuesta.descripcion;
          this.openPopupRes();
          if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
              this.indRespuesta = true;
              this.getCategorias();
              this.inicializarComponentesGuarCat();
          }else{
            this.indRespuesta = false;
          }
        });
    }
  }

  guardarUnidad() {
    if (this.validarGuardarUnidad()) {
        this.hidePopupGC();
        this.categoria.codigo = this.obtenerFormGuarUnid.scategoriau.value;
        this.unidad.descripcion= this.obtenerFormGuarUnid.descripcionUnidad.value;
        this.unidad.codigoCategoria = this.categoria.codigo;
        this.unidadService.guardarUnidad(this.unidad).subscribe(respuesta => {
          this.respuesta = respuesta;
          this.descripcionRes = this.respuesta.descripcion;
          this.openPopupRes();
          if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
              this.indRespuesta = true;
              this.getTipoUnidades();
              this.inicializarComponentesGuarUni();
          }else{
            this.indRespuesta = false;
          }
        });
    }
  }

  guardarProducto() {
    this.loading = true;
    this.hidePopupGP();
    this.producto.descripcion = this.obtenerGuardarProForm.descProducto.value;
    this.producto.codigoCategoria = this.obtenerGuardarProForm.scategoria.value;
    this.productoServices.guardarProducto(this.producto).subscribe(respuesta => {
      this.respuesta = respuesta;
      this.descripcionRes = this.respuesta.descripcion ;
      this.indRespuesta = true;
      this.openPopupRes();
      if ( this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
          this.inicializarComponenteGP();
          this.getProductos();
     }
    });
    this.loading = false;
  }
 calcularPrecioFinal() {
   
  if(this.obtenerInvForm.punitario.value != null && this.obtenerInvForm.punitario.value !== undefined){
    let valorUni: string = this.obtenerInvForm.punitario.value.replace(',','').replace(',','').replace(',','');
    
    this.obtenerInvForm.punitario.setValue(this.numberFormatPipe.transform(valorUni));
  }
  if ((this.obtenerInvForm.punitario.value != null && this.obtenerInvForm.punitario.value !== undefined) 
   && (this.obtenerInvForm.pganancia.value != null && this.obtenerInvForm.pganancia.value !== undefined)){
     let valorUni: string = this.obtenerInvForm.punitario.value.replace(',','').replace(',','').replace(',','');
     const valorGanancia = Number(valorUni) * this.obtenerInvForm.pganancia.value / 100;
     const valorFinal = Number(valorUni) + Number(valorGanancia);
     this.detalleProducto.precioFinal = valorFinal;
  }
 }

 guardarInventario() {
   this.hidePopupConf();
   this.detalleProducto.producto.codigo = this.obtenerInvForm.sproducto.value;
   let valorPreVen: string = this.obtenerInvForm.punitario.value.replace(',','').replace(',','').replace(',','');;
   this.detalleProducto.precioUnitario = Number(valorPreVen);
   this.detalleProducto.porcentajeGanancia = this.obtenerInvForm.pganancia.value;
   let cantidad: number = this.obtenerInvForm.cantidad.value.replace(',','').replace(',','').replace(',','');;
   this.detalleProducto.cantidad = cantidad;
   this.detalleProducto.tipoUnidad.codigo = this.obtenerInvForm.sunidad.value;
   this.detalleProducto.codigoBarras = this.obtenerInvForm.codBarras.value;
   this.inventarioServices.guardarInventario(this.detalleProducto).subscribe(respuesta => {
    this.respuesta = respuesta;
    if ( this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
       this.inicializarComponentesInv();
    }
    this.descripcionRes = this.respuesta.descripcion;
    this.indRespuesta = true;
    this.openPopupRes();
  });
 }

  onChangeSeleccionarCategoriaGP() {
    this.producto.codigoCategoria = this.obtenerGuardarProForm.scategoria.value;
    this.getProductos();
  }
  onChangeSeleccionarCategoriaINV() {
    this.producto.codigoCategoria = this.obtenerInvForm.scategoriai.value;
    this.categoria.codigo= this.obtenerInvForm.scategoriai.value;
    this.getProductos();
    this.getTipoUnidades();
  }

  validarGuardarCategoria(): boolean {
    this.message = '';
    this.indVisibleMessa = false;
    let indValidacionCompleta = true;
    if (this.obtenerFormGuarCate.descripcionCategoria.value == null || this.obtenerFormGuarCate.descripcionCategoria.value === undefined){
        this.message = 'Por favor debe ingresar la descripción categoria';
        indValidacionCompleta = false;
        this.indVisibleMessa = true;
    }

    return indValidacionCompleta;
  }

  validarGuardarUnidad(): boolean {
    this.message = '';
    this.indVisibleMessa = false;
    let indValidacionCompleta = true;
    if (this.obtenerFormGuarUnid.scategoriau.value == null || this.obtenerFormGuarUnid.scategoriau.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
   }
    if (this.obtenerFormGuarUnid.descripcionUnidad.value == null || this.obtenerFormGuarUnid.descripcionUnidad.value === undefined){
        this.message = 'Por favor debe ingresar los datos completos';
        indValidacionCompleta = false;
        this.indVisibleMessa = true;
    }

    return indValidacionCompleta;
  }

  hidePopupGC() {
    this.modalgc = 'none';
  }
  openPopupGC() {
    this.modalgc = 'block';
  }
  hidePopupGU() {
    this.modalgu = 'none';
  }
  openPopupGU() {
    this.modalgu = 'block';
  }

  hidePopupGP() {
    this.modalgp = 'none';
  }
  openPopupGP() {
    this.modalgp = 'block';
  }
  hidePopupRes() {
    this.modalres = 'none';
  }
  openPopupRes() {
    this.modalres = 'block';
  }
  hidePopupConf() {
    this.modalconf = 'none';
  }
  openPopupConf() {
     if (!this.validarCampos()) {
          this.modalconf = 'block';
     }
  }
   validarCampos(): boolean {
    this.indValidacion = false;
    this.message = '';
    if (this.obtenerInvForm.scategoriai.value == null || this.obtenerInvForm.scategoriai.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
   }
    if (this.obtenerInvForm.sproducto.value == null || this.obtenerInvForm.sproducto.value === 0) {
       this.message = 'Por favor debe ingresar los datos completos';
       this.indValidacion = true;
    }
    if (this.obtenerInvForm.punitario.value == null || this.obtenerInvForm.punitario.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
    }
    if (this.obtenerInvForm.pganancia.value == null || this.obtenerInvForm.pganancia.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
    }
    if (this.obtenerInvForm.cantidad.value == null || this.obtenerInvForm.cantidad.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
    }
    if (this.obtenerInvForm.sunidad.value == null || this.obtenerInvForm.sunidad.value === 0) {
      this.message = 'Por favor debe ingresar los datos completos';
      this.indValidacion = true;
    }
     return this.indValidacion;
   }
    volverInicio() {
      this.router.navigate( ['home']);
    }

}
