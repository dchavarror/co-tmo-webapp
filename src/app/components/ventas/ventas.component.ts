import { Component, OnInit } from "@angular/core";
import { Producto } from "../../domain/producto";
import { ProductoService } from "../../services/producto.service";
import { NumberFormatPipe } from "../../pipes/numberformat.pipe";
import { Usuario } from "../../domain/usuario";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Respuesta } from "src/app/domain/respuesta";
import { DetalleProducto } from "../../domain/detalle.producto";
import { stringify } from "querystring";
import { Venta } from "../../domain/venta";
import { DecimalPipe, formatCurrency, formatNumber } from "@angular/common";
import { VentaService } from "../../services/venta.service";
import { InventarioService } from "../../services/inventario.service";
import { Router } from "@angular/router";
import { CategoriaService } from "../../services/categoria.service";
import { TipoGenerico } from "../../domain/tipoGenerico";
import { environment } from "../../../environments/environment";
import { GenericoService } from "../../services/generico.service";
import { Utils } from "../../utils/utils";
import { UnidadService } from "../../services/unidad.service";

@Component({
  selector: "app-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.css"],
})
export class VentasComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaCategorias: TipoGenerico[] = [];
  listaUnidades: TipoGenerico[] = [];
  listaVentas: Venta[] = [];
  ventasForm: FormGroup;
  factForm: FormGroup;
  producto: Producto = new Producto();
  respuesta: Respuesta = new Respuesta();
  venta: Venta = new Venta();
  subTotal = 0;
  indMostrarSubTotal = false;
  listaInventarios: DetalleProducto[] = [];
  precioVenta = 0;
  message: string;
  NO_EXISTE_INVENTARIO = "No existe inventario del producto seleccionado";
  RECUERDE_STOP_INVENTARIO =
    "Recuerde que solo tiene la siguiente cantidad en stop: ";
  NO_PUEDE_SUPERAR_STOP = "No puede superar la cantidad que tiene en stop";
  indVisibleMessage: boolean;
  modalconf = "none";
  modalres = "none";
  indRespuesta = false;
  TIPO_RESPUESTA_OK = "OK";
  indValidacion: boolean;
  tipoUnidad: TipoGenerico;
  indAplicaFactura: boolean;
  cambio: number;
  indVisibleMessa: boolean;
  consCodBarrasForm: FormGroup;
  modalcodbarras = "none";

  constructor(
    private productoServices: ProductoService,
    private ventaServices: VentaService,
    private inventarioServices: InventarioService,
    private categoriaServices: CategoriaService,
    private genericoServices: GenericoService,
    private fb: FormBuilder,
    private router: Router,
    private utils: Utils,
    private numberFormatPipe: NumberFormatPipe,
    private unidadService: UnidadService
  ) {
    this.asignarValoresVariables();
    this.getCategorias();
    this.indVisibleMessage = false;
  }
  asignarValoresVariables() {
    this.producto.usuario.nombre = localStorage.getItem("usuario");
    this.producto.usuario.empresa.nit = localStorage.getItem("nit");
    this.producto.usuario.empresa.razonSocial =
      localStorage.getItem("razonSocial");
    this.producto.usuario.codigoSegmento = Number(
      localStorage.getItem("codigoSegmento")
    );
    this.venta.usuario.nombre = this.producto.usuario.nombre;
    this.venta.usuario.empresa.nit = this.producto.usuario.empresa.nit;
    this.venta.usuario.empresa.razonSocial =
      this.producto.usuario.empresa.razonSocial;
    this.venta.usuario.codigoSegmento = this.producto.usuario.codigoSegmento;
    this.venta.producto.usuario.nombre = this.producto.usuario.nombre;
    this.venta.producto.usuario.empresa.nit = this.producto.usuario.empresa.nit;
    this.venta.producto.usuario.empresa.razonSocial =
      this.producto.usuario.empresa.razonSocial;
    this.venta.producto.usuario.codigoSegmento =
      this.producto.usuario.codigoSegmento;
  }
  ngOnInit() {
    this.inicializarComponentes();
  }

  inicializarComponentes() {
    this.ventasForm = this.fb.group({
      scategoria: new FormControl(),
      sproducto: new FormControl(),
      punitario: new FormControl(),
      cantidad: new FormControl(),
      pventa: new FormControl(),
      vtotal: new FormControl(),
      sunidad: new FormControl(),
    });
    this.factForm = this.fb.group({
      rgenfact: new FormControl(),
      nombre: new FormControl(),
      pagan: new FormControl(),
      cambio: new FormControl(),
    });
    this.consCodBarrasForm = this.fb.group({
      codBarras: new FormControl(),
      cantidad: new FormControl(),
    });
  }

  get obtenerVentaForm() {
    return this.ventasForm.controls;
  }
  get obtenerFactForm() {
    return this.factForm.controls;
  }
  get obtenerCodBarrasForm() {
    return this.consCodBarrasForm.controls;
  }

  getProductos() {
    this.productoServices
      .obtenerProducto(this.producto)
      .subscribe((productos) => {
        this.listaProductos = productos;
      });
  }

  getTipoUnidades() {
    this.unidadService
      .obtenerUnidades(Number(this.producto.codigoCategoria))
      .subscribe((unidades) => {
        this.listaUnidades = unidades;
      });
  }

  getCategorias() {
    this.categoriaServices
      .obtenerCategorias(this.producto.usuario.codigoSegmento)
      .subscribe((categorias) => {
        this.listaCategorias = categorias;
      });
  }

  agregarVenta() {
    if (!this.validarCampos()) {
      let codProducto = this.obtenerVentaForm.sproducto.value;
      let codUnidad = this.obtenerVentaForm.sunidad.value;
      let valorPreVen: string = this.obtenerVentaForm.pventa.value
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");
      let cantidad = this.obtenerVentaForm.cantidad.value;
      if (
        !this.actualizarVentaManual(
          codProducto,
          codUnidad,
          cantidad,
          valorPreVen
        )
      ) {
        this.indValidacion = false;
        this.message = "";
        this.venta.cantidad = cantidad;

        this.venta.precioVenta = Number(valorPreVen);
        this.venta.producto.codigo = codProducto;
        this.venta.producto.tipoUnidad.codigo = codUnidad;
        this.venta.producto.tipoUnidad.descripcion =
          this.obtenerDescripcionUnidad(codUnidad);
        this.venta.producto.descripcion = this.obtenerDescProducto(codProducto);
        const valorTotal = Number(valorPreVen) * cantidad;
        this.venta.valorTotal = valorTotal;
        this.indMostrarSubTotal = true;
        this.venta.cantidadInventario = this.listaInventarios[0].cantidad;
        this.listaVentas.push(this.venta);
        this.sumarSubTotal();
        this.venta = new Venta();
        this.inicializarComponentes();
        this.asignarValoresVariables();
        this.obtenerFactForm.rgenfact.setValue(false);
      }else{
        this.inicializarComponentes();
        this.asignarValoresVariables();
        this.obtenerFactForm.rgenfact.setValue(false);
      }
    }
  }

  obtenerDescripcionUnidad(codigo: string): string {
    let descripcion = "";
    for (let i = 0; i < this.listaUnidades.length; i++) {
      if (this.listaUnidades[i].codigo == codigo) {
        descripcion = this.listaUnidades[i].descripcion;
        break;
      }
    }
    return descripcion;
  }

  calcularValorTotal() {
    if (
      this.obtenerVentaForm.pventa.value != null &&
      this.obtenerVentaForm.pventa.value !== undefined &&
      this.obtenerVentaForm.pventa.value !== ""
    ) {
      let valorConver = String(this.obtenerVentaForm.pventa.value);
      let valorPreVen: string = valorConver
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");
      this.obtenerVentaForm.pventa.setValue(
        this.numberFormatPipe.transform(valorPreVen)
      );
    }
    if (
      this.obtenerVentaForm.pventa.value != null &&
      this.obtenerVentaForm.pventa.value !== undefined &&
      this.obtenerVentaForm.pventa.value !== "" &&
      this.obtenerVentaForm.cantidad.value != null &&
      this.obtenerVentaForm.cantidad.value !== undefined &&
      this.obtenerVentaForm.cantidad.value !== "" &&
      this.listaInventarios != null &&
      this.listaInventarios.length > 0
    ) {
      this.message = "";
      this.indVisibleMessage = false;
      if (
        this.listaInventarios[0].cantidad >=
        this.obtenerVentaForm.cantidad.value
      ) {
        if (
          this.obtenerVentaForm.pventa.value !== "" &&
          this.obtenerVentaForm.cantidad.value !== ""
        ) {
          let valorPreVen: string = this.obtenerVentaForm.pventa.value
            .replace(",", "")
            .replace(",", "")
            .replace(",", "");
          const valorTotal =
            Number(valorPreVen) * this.obtenerVentaForm.cantidad.value;
          this.venta.valorTotal = valorTotal;
          this.message =
            this.RECUERDE_STOP_INVENTARIO + this.listaInventarios[0].cantidad;
          this.indVisibleMessage = true;
        }
      } else {
        this.venta.cantidad = 0;
        this.obtenerVentaForm.cantidad.setValue(0);
        this.venta.valorTotal = 0;
        this.indVisibleMessage = true;
        this.message = this.NO_PUEDE_SUPERAR_STOP;
      }
    }
  }

  obtenerDescProducto(codigo: number): string {
    let descripcion: string;
    for (let i = 0; i < this.listaProductos.length; i++) {
      if (codigo == this.listaProductos[i].codigo) {
        descripcion = this.listaProductos[i].descripcion;
      }
    }
    return descripcion;
  }
  eliminarVenta(poss) {
    this.listaVentas.splice(poss, 1);
    let total = 0;
    for (let i = 0; i < this.listaVentas.length; i++) {
      total = total + this.listaVentas[i].valorTotal;
    }
    this.subTotal = total;
    if (this.listaVentas.length === 0) {
      this.indMostrarSubTotal = false;
    }
  }
  obtenerInventario() {
    this.indVisibleMessage = false;
    this.venta.producto.codigo = this.obtenerVentaForm.sproducto.value;
    this.venta.producto.tipoUnidad.codigo = this.obtenerVentaForm.sunidad.value;
    if (
      this.obtenerVentaForm.sunidad.value != null &&
      this.obtenerVentaForm.sunidad.value != 0 &&
      this.obtenerVentaForm.sunidad.value != "" &&
      this.obtenerVentaForm.sproducto.value != null &&
      this.obtenerVentaForm.sproducto.value != 0 &&
      this.obtenerVentaForm.sproducto.value != ""
    ) {
      this.inventarioServices
        .obtenerInventario(this.venta.producto)
        .subscribe((listaInventarios) => {
          if (listaInventarios != null && listaInventarios.length > 0) {
            this.listaInventarios = listaInventarios;
            this.venta.precioVenta = this.listaInventarios[0].precioFinal;
            this.obtenerVentaForm.pventa.setValue(
              this.listaInventarios[0].precioFinal
            );
            this.precioVenta = this.listaInventarios[0].precioFinal;
            this.indVisibleMessage = true;
            if (this.listaInventarios[0].cantidad <= 0) {
              this.message = this.NO_EXISTE_INVENTARIO;
              this.venta.producto.codigo = null;
            } else {
              this.message =
                this.RECUERDE_STOP_INVENTARIO +
                this.listaInventarios[0].cantidad;
              this.calcularValorTotal();
            }
          } else {
            this.indVisibleMessage = true;
            this.message = this.NO_EXISTE_INVENTARIO;
            this.venta.precioVenta = 0;
            this.venta.producto.codigo = null;
          }
        });
    }
  }
  guardarVentas() {
    this.hidePopupConf();
    this.indAplicaFactura = this.obtenerFactForm.rgenfact.value;
    let paganCon = 0;
    if (
      this.obtenerFactForm.pagan.value != null &&
      this.obtenerFactForm.pagan.value != undefined &&
      this.obtenerFactForm.pagan.value != ""
    ) {
      paganCon = this.obtenerFactForm.pagan.value
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");
    }
    this.asignarValoresVariables();
    this.ventaServices
      .guardarVentas(
        this.listaVentas,
        this.obtenerFactForm.rgenfact.value,
        this.obtenerFactForm.nombre.value,
        paganCon
      )
      .subscribe((respuesta) => {
        this.respuesta = respuesta;
        if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
          this.listaVentas = [];
          this.venta = new Venta();
          this.inicializarComponentes();
          this.subTotal = 0;
          this.indMostrarSubTotal = false;
          if (this.indAplicaFactura == true) {
            this.imprimirFactura(this.respuesta.documento);
          }
        }
        this.indRespuesta = true;
        this.openPopupRes();
        this.asignarValoresVariables();
        this.indAplicaFactura = false;
      });
  }
  actualizarCambio() {
    let valor = this.obtenerFactForm.pagan.value
      .replace(",", "")
      .replace(",", "")
      .replace(",", "");
    this.obtenerFactForm.pagan.setValue(this.numberFormatPipe.transform(valor));
    if (valor >= this.subTotal) {
      this.cambio = valor - this.subTotal;
    }
  }
  onClickRequiereFactura() {
    this.indAplicaFactura = this.obtenerFactForm.rgenfact.value;
  }
  imprimirFactura(documento) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = this.utils.convertBase64ToBlobURL(documento);
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  hidePopupRes() {
    this.modalres = "none";
  }
  openPopupRes() {
    this.modalres = "block";
  }

  hidePopupConf() {
    this.modalconf = "none";
  }
  openPopupConf() {
    this.modalconf = "block";
  }

  validarCampos(): boolean {
    this.indValidacion = false;
    this.indVisibleMessage = false;
    this.message = "";
    if (
      this.obtenerVentaForm.scategoria.value == null ||
      this.obtenerVentaForm.scategoria.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerVentaForm.sproducto.value == null ||
      this.obtenerVentaForm.sproducto.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerVentaForm.pventa.value == null ||
      this.obtenerVentaForm.pventa.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerVentaForm.cantidad.value == null ||
      this.obtenerVentaForm.cantidad.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerVentaForm.sunidad.value == null ||
      this.obtenerVentaForm.sunidad.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    return this.indValidacion;
  }

  volverInicio() {
    this.router.navigate(["home"]);
  }

  onChangeSeleccionarCategoria() {
    this.producto.codigoCategoria = this.obtenerVentaForm.scategoria.value;
    this.getProductos();
    this.getTipoUnidades();
  }
  consultarPorCodigoBarras() {
    this.indRespuesta = false;
    this.indVisibleMessage = false;
    this.indVisibleMessa = false;
    this.indAplicaFactura= false;
    if (this.obtenerCodBarrasForm.codBarras.value != null) {
      this.venta.producto.codigoBarras =
        this.obtenerCodBarrasForm.codBarras.value;
      this.inventarioServices
        .obtenerInventario(this.venta.producto)
        .subscribe((listaInventarios) => {
          if (listaInventarios != null && listaInventarios.length > 0) {

            this.listaInventarios = listaInventarios;
            if (!this.actualizarVenta(this.venta.producto.codigoBarras)) {
              this.venta.precioVenta = Number(
                this.listaInventarios[0].precioFinal
              );
              this.venta.producto.tipoUnidad.codigo =
                this.listaInventarios[0].tipoUnidad.codigo;
                this.venta.producto.tipoUnidad.descripcion =
                this.listaInventarios[0].tipoUnidad.descripcion;
                this.venta.producto.codigo =
                this.listaInventarios[0].producto.codigo;
                this.venta.producto.descripcion =
                this.listaInventarios[0].producto.descripcion;
                this.venta.producto.codigoBarras =
                this.venta.producto.codigoBarras;
                this.venta.cantidad = 1;
                this.venta.valorTotal = this.venta.precioVenta * this.venta.cantidad;
                this.venta.cantidadInventario = this.listaInventarios[0].cantidad;

              this.indMostrarSubTotal = true;
              this.listaVentas.push(this.venta);
              this.sumarSubTotal();
              this.venta = new Venta();
              this.inicializarComponentes();
              this.asignarValoresVariables();
              this.obtenerFactForm.rgenfact.setValue(false);
              this.indAplicaFactura = false;
            } else {
              this.venta = new Venta();
              this.inicializarComponentes();
              this.asignarValoresVariables();
              this.obtenerFactForm.rgenfact.setValue(false);
            }
          } else {
            this.message = this.NO_EXISTE_INVENTARIO;
            this.indVisibleMessa = true;
          }
        });
    }
  }

  calcularValorTotalCantidad(e, pos) {
    let cantInv = this.listaVentas[pos].cantidadInventario;
    if (cantInv >= e.target.value) {
      this.listaVentas[pos].valorTotal =
        this.listaVentas[pos].precioVenta * e.target.value;
      this.sumarSubTotal();
    } else {
      this.listaVentas[pos].cantidad = cantInv;
      this.message = this.NO_PUEDE_SUPERAR_STOP;
      this.indRespuesta = true;
      this.respuesta.descripcion = this.message;
      this.openPopupRes();
    }
  }

  actualizarVenta(codigoBarras: String): Boolean {
    let indRespuesta = false;
    if (this.listaVentas != null && this.listaVentas.length > 0) {
      for (let i = 0; i < this.listaVentas.length; i++) {
        if (this.listaVentas[i].producto.codigoBarras == codigoBarras) {
          let cantInv = this.listaVentas[i].cantidadInventario;
          if (cantInv >= this.listaVentas[i].cantidad) {
            this.listaVentas[i].cantidad = this.listaVentas[i].cantidad + 1;
            this.listaVentas[i].valorTotal =
              this.listaVentas[i].precioVenta * this.listaVentas[i].cantidad;
            this.sumarSubTotal();
          } else {
            this.listaVentas[i].cantidad = cantInv;
            this.message = this.NO_PUEDE_SUPERAR_STOP;
            this.indRespuesta = true;
            this.respuesta.descripcion = this.message;
            this.openPopupRes();
          }
          indRespuesta = true;
          break;
        }
      }
      return indRespuesta;
    }
  }

  obtenerCantidadVentaManual(codigoProd, codigoUnid): number {
    let resultado = 0;
    if (this.listaVentas != null && this.listaVentas.length > 0) {
      for (let i = 0; i < this.listaVentas.length; i++) {
        if (
          this.listaVentas[i].producto.tipoUnidad.codigo == codigoUnid &&
          this.listaVentas[i].producto.codigo == codigoProd
        ) {
          resultado = this.listaVentas[i].cantidad;
        }
      }
    }
    return resultado;
  }

  sumarSubTotal() {
    let subTotalTmp = 0;
    if (this.listaVentas != null && this.listaVentas.length > 0) {
      for (let i = 0; i < this.listaVentas.length; i++) {
        subTotalTmp += this.listaVentas[i].valorTotal;
      }
    }
    this.subTotal = subTotalTmp;
  }

  actualizarVentaManual(
    codigoProd,
    codigoUnid,
    cantidad,
    precioVenta
  ): Boolean {
    let indRespuesta = false;
    if (this.listaVentas != null && this.listaVentas.length > 0) {
      for (let i = 0; i < this.listaVentas.length; i++) {
        if (
          this.listaVentas[i].producto.codigo == codigoProd &&
          this.listaVentas[i].producto.tipoUnidad.codigo == codigoUnid
        ) {
          let cantInv = this.listaVentas[i].cantidadInventario;
          let cantVen = this.obtenerCantidadVentaManual(codigoProd, codigoUnid);
          let cantidadFinal = cantidad + cantVen;
          if (cantInv >= cantidadFinal) {
            this.listaVentas[i].cantidad =
              this.listaVentas[i].cantidad + cantidad;
            this.listaVentas[i].valorTotal =
              precioVenta * this.listaVentas[i].cantidad;
            this.sumarSubTotal();
          } else {
            this.message = this.NO_PUEDE_SUPERAR_STOP;
            this.indRespuesta = true;
            this.respuesta.descripcion = this.message;
            this.openPopupRes();
          }
          indRespuesta = true;
          break;
        }
      }
      return indRespuesta;
    }
  }

  hidePopupCB() {
    this.modalcodbarras = "none";
  }
  openPopupCB() {
    this.modalcodbarras = "block";
  }
}
