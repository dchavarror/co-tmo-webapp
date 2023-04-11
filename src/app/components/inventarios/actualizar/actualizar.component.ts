import { Component, OnInit } from "@angular/core";
import { Producto } from "../../../domain/producto";
import { Categoria } from "../../../domain/categoria";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Respuesta } from "../../../domain/respuesta";
import { ProductoService } from "../../../services/producto.service";
import { NumberFormatPipe } from "../../../pipes/numberformat.pipe";
import { CategoriaService } from "../../../services/categoria.service";
import { InventarioService } from "../../../services/inventario.service";
import { Segmento } from "../../../domain/segmento";
import { DetalleProducto } from "../../../domain/detalle.producto";
import { TipoGenerico } from "../../../domain/tipoGenerico";
import { UnidadService } from "../../../services/unidad.service";

@Component({
  selector: "app-actualizar",
  templateUrl: "./actualizar.component.html",
  styleUrls: ["./actualizar.component.css"],
})
export class ActualizarComponent implements OnInit {
  NO_EXISTE_INVENTARIO = "No existe inventario del producto seleccionado";
  TIPO_RESPUESTA_OK = "OK";

  listaProductos: Producto[] = [];
  listaCategorias: Categoria[] = [];
  listaUnidades: TipoGenerico[] = [];
  listaInventarios: DetalleProducto[] = [];

  categoria = new Categoria();
  producto: Producto = new Producto();
  invActualizarForm: FormGroup;
  respuesta: Respuesta = new Respuesta();
  segmento = new Segmento();
  detalleProducto: DetalleProducto = new DetalleProducto();

  indVisibleMessage: boolean;
  indRespuesta = false;
  indValidacion: boolean;
  modalres = "none";
  modalconf = "none";
  message: string;
  descripcionRes: String;

  constructor(
    private productoServices: ProductoService,
    private numberFormatPipe: NumberFormatPipe,
    private fb: FormBuilder,
    private categoriaServices: CategoriaService,
    private inventarioServices: InventarioService,
    private unidadService: UnidadService
  ) {
    this.indValidacion = false;
  }

  ngOnInit(): void {
    this.inicializarComponentesInv();
    this.asignarValoresVariables();
    this.getCategorias();
  }

  inicializarComponentesInv() {
    this.invActualizarForm = this.fb.group({
      scategoria: new FormControl(),
      sproducto: new FormControl(),
      punitario: new FormControl(),
      pganancia: new FormControl(),
      pfinal: new FormControl(),
      cantidad: new FormControl(),
      sunidad: new FormControl(),
    });
  }

  asignarValoresVariables() {
    this.producto.usuario.nombre = localStorage.getItem("usuario");
    this.producto.usuario.empresa.nit = localStorage.getItem("nit");
    this.producto.usuario.empresa.razonSocial =
    localStorage.getItem("razonSocial");
    this.producto.usuario.codigoSegmento = Number(
      localStorage.getItem("codigoSegmento")
    );
    this.segmento.codigo = this.producto.usuario.codigoSegmento;
    this.detalleProducto.usuario.nombre = this.producto.usuario.nombre;
    this.detalleProducto.usuario.empresa.nit =
      this.producto.usuario.empresa.nit;
    this.detalleProducto.usuario.empresa.razonSocial =
      this.producto.usuario.empresa.razonSocial;
  }

  get obtenerInvActualizarForm() {
    return this.invActualizarForm.controls;
  }

  getCategorias() {
    this.categoriaServices
      .obtenerCategorias(this.producto.usuario.codigoSegmento)
      .subscribe((categorias) => {
        this.listaCategorias = categorias;
      });
  }

  getTipoUnidades() {
    this.unidadService
      .obtenerUnidades(Number(this.categoria.codigo))
      .subscribe((unidades) => {
        this.listaUnidades = unidades;
      });
  }
  getProductos() {
    this.productoServices
      .obtenerProducto(this.producto)
      .subscribe((productos) => {
        this.listaProductos = productos;
      });
  }

  obtenerInventario() {
    this.indVisibleMessage = false;

    if (
      this.obtenerInvActualizarForm.sunidad.value != null &&
      this.obtenerInvActualizarForm.sunidad.value != 0 &&
      this.obtenerInvActualizarForm.sunidad.value != "" &&
      this.obtenerInvActualizarForm.sproducto.value != null &&
      this.obtenerInvActualizarForm.sproducto.value != 0 &&
      this.obtenerInvActualizarForm.sproducto.value != ""
    ) {
      this.producto.codigo = this.obtenerInvActualizarForm.sproducto.value;
      this.producto.tipoUnidad.codigo =
        this.obtenerInvActualizarForm.sunidad.value;
      this.inventarioServices
        .obtenerInventario(this.producto)
        .subscribe((listaInventarios) => {
          if (listaInventarios != null && listaInventarios.length > 0) {
            this.listaInventarios = listaInventarios;
            this.detalleProducto.precioUnitario =
              this.listaInventarios[0].precioUnitario;
            this.detalleProducto.cantidad = this.listaInventarios[0].cantidad;
            this.detalleProducto.porcentajeGanancia =
              this.listaInventarios[0].porcentajeGanancia;

            const valorGanancia =
              (this.detalleProducto.precioUnitario *
                this.detalleProducto.porcentajeGanancia) /
              100;
            const valorFinal =
              this.detalleProducto.precioUnitario + Number(valorGanancia);
              this.detalleProducto.precioFinal =valorFinal;
              
              this.obtenerInvActualizarForm.punitario.setValue(
                this.numberFormatPipe.transform(String(this.detalleProducto.precioUnitario))
              );
              this.obtenerInvActualizarForm.pganancia.setValue(
                this.numberFormatPipe.transform(String(this.detalleProducto.porcentajeGanancia))
              );
              this.obtenerInvActualizarForm.cantidad.setValue(
                this.numberFormatPipe.transform(String(this.detalleProducto.cantidad))
              );
              this.obtenerInvActualizarForm.pfinal.setValue(
                this.numberFormatPipe.transform(String(this.detalleProducto.precioFinal))
              );
            this.detalleProducto.precioFinal = valorFinal;
            if (this.listaInventarios[0].cantidad <= 0) {
              this.message = this.NO_EXISTE_INVENTARIO;
              this.producto.codigo = null;
            }
          } else {
            this.indVisibleMessage = true;
            this.message = this.NO_EXISTE_INVENTARIO;
            this.detalleProducto.precioUnitario = 0;
          }
        });
    }
  }

  actualizarInventario() {
    this.hidePopupConf();
    this.detalleProducto.producto.codigo =
      this.obtenerInvActualizarForm.sproducto.value;
    let valorPreVen: string = this.obtenerInvActualizarForm.punitario.value
      .replace(",", "")
      .replace(",", "")
      .replace(",", "");
    this.detalleProducto.precioUnitario = Number(valorPreVen);
    this.detalleProducto.porcentajeGanancia =
      this.obtenerInvActualizarForm.pganancia.value;
    let cantidad: number = this.obtenerInvActualizarForm.cantidad.value
      .replace(",", "")
      .replace(",", "")
      .replace(",", "");
    this.detalleProducto.cantidad = cantidad;
    this.detalleProducto.tipoUnidad.codigo =
      this.obtenerInvActualizarForm.sunidad.value;
    this.inventarioServices
      .actualizarInventario(this.detalleProducto)
      .subscribe((respuesta) => {
        this.respuesta = respuesta;
        if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
          this.inicializarComponentesInv();
        }
        this.descripcionRes = this.respuesta.descripcion;
        this.indRespuesta = true;
        this.openPopupRes();
      });
  }

  onChangeSeleccionarCategoriaInvAct() {
    this.producto.codigoCategoria =
      this.obtenerInvActualizarForm.scategoria.value;
    this.categoria.codigo = this.obtenerInvActualizarForm.scategoria.value;
    this.getProductos();
    this.getTipoUnidades();
  }

  calcularPrecioFinal() {
    if (
      this.obtenerInvActualizarForm.punitario.value != null &&
      this.obtenerInvActualizarForm.punitario.value !== undefined
    ) {
      let valorUni: string = this.obtenerInvActualizarForm.punitario.value
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");

      this.obtenerInvActualizarForm.punitario.setValue(
        this.numberFormatPipe.transform(valorUni)
      );
    }
    if (
      this.obtenerInvActualizarForm.punitario.value != null &&
      this.obtenerInvActualizarForm.punitario.value !== undefined &&
      this.obtenerInvActualizarForm.pganancia.value != null &&
      this.obtenerInvActualizarForm.pganancia.value !== undefined
    ) {
      let valorUni: string = this.obtenerInvActualizarForm.punitario.value
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");
      const valorGanancia =
        (Number(valorUni) * this.obtenerInvActualizarForm.pganancia.value) /
        100;
      const valorFinal = Number(valorUni) + Number(valorGanancia);
      this.detalleProducto.precioFinal = valorFinal;
    }
  }
  validarCampos(): boolean {
    this.indValidacion = false;
    this.message = "";
    if (
      this.obtenerInvActualizarForm.scategoria.value == null ||
      this.obtenerInvActualizarForm.scategoria.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerInvActualizarForm.sproducto.value == null ||
      this.obtenerInvActualizarForm.sproducto.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerInvActualizarForm.punitario.value == null ||
      this.obtenerInvActualizarForm.punitario.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerInvActualizarForm.pganancia.value == null ||
      this.obtenerInvActualizarForm.pganancia.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    if (
      this.obtenerInvActualizarForm.cantidad.value == null ||
      this.obtenerInvActualizarForm.cantidad.value === 0
    ) {
      this.message = "Por favor debe ingresar los datos completos";
      this.indValidacion = true;
    }
    return this.indValidacion;
  }

  openPopupConf() {
    if (!this.validarCampos()) {
      this.modalconf = "block";
    }
  }
  hidePopupConf() {
    this.modalconf = "none";
  }
  hidePopupRes() {
    this.modalres = "none";
  }
  openPopupRes() {
    this.modalres = "block";
  }
}
