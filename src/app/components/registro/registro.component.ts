import { Component, OnInit } from '@angular/core';
import { SegmentoService } from '../../services/segmento.service';
import { CategoriaService } from '../../services/categoria.service';
import { DepartamentoService } from '../../services/departamento.service';
import { MunicipioService } from '../../services/municipio.service';
import { EmpresaService } from '../../services/empresa.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Segmento } from 'src/app/domain/segmento';
import { Categoria } from 'src/app/domain/categoria';
import { Departamento } from 'src/app/domain/departamento';
import { Municipio } from 'src/app/domain/municipio';
import { GestionarEmpresaRequest } from '../../domain/gestionarEmpresaRequest';
import { Respuesta } from 'src/app/domain/respuesta';
import { Telefono } from '../../domain/telefono';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: []
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup;
  guarSegmentoForm: FormGroup;
  guarCategoriaForm: FormGroup;

  listaSegmentos: Segmento[] = [];
  listaDepartamentos: Departamento[] = [];
  listaMunicipios: Municipio[] = [];
  gestionarEmpresaRequest = new GestionarEmpresaRequest();
  segmento = new Segmento();
  categoria = new Categoria();
  departamento = new Departamento();
  municipio = new Municipio();
  respuesta = new Respuesta();
  message: string;
  indVisibleMessa: boolean;
  indRespuesta: boolean;
  TIPO_RESPUESTA_OK = 'OK';
  TIPO_PERSONA_JURICA = '02';
  TIPO_DIRECCION_ELECTONICA = '01';
  TIPO_DIRECCION_FISICA = '02';
  TIPO_TELEFONO_CELU = '01';
  TIPO_TELEFONO_FIJO = '02';
  MENSAJE_GUARDADO_EXITOSAMENTE  = 'SE REGISTRO EXITOSAMENTE LA EMPRESA';
  modalgs = 'none';
  modalres = 'none';
  modalconf = 'none';

  constructor(private segmentoService: SegmentoService,
    private departamentoService: DepartamentoService,
    private municipioService: MunicipioService,
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private router: Router) {
      this.getSegmentos();
      this.getDepartamentos();
     }

  ngOnInit() {
    this.inicializarComponentesRegistro();
    this.inicializarComponentesGuarSeg();
    this.inicializarComponentesGuarCat();
  }

  inicializarComponentesRegistro() {
    this.registroForm = this.fb.group({
      ssegmento: new FormControl(),
      scategoria:  new FormControl(),
      primerNombre: new FormControl(),
      segundoNombre: new FormControl(),
      primerApellido: new FormControl(),
      segundoApellido: new FormControl(),
      numIdentificacion: new FormControl(),
      fecNacimiento: new FormControl(),
      tipoPersona: new FormControl(),
      nombreUsu: new FormControl(),
      password: new FormControl(),
      razonSocial: new FormControl(),
      nit: new FormControl(),
      direccionElectronica: new FormControl(),
      direccionFisica: new FormControl(),
      numeroTelefono: new FormControl(),
      numeroCelular: new FormControl(),
      codigoDepartamento: new FormControl(),
      codigoMunicipio: new FormControl(),

    });
  }
  inicializarComponentesGuarSeg() {
    this.guarSegmentoForm = this.fb.group({
      descripcionSegmento: new FormControl(),
    });
  }

  inicializarComponentesGuarCat() {
    this.guarCategoriaForm = this.fb.group({
      descripcionCategoria: new FormControl(),
    });
  }

  get obtenerFormRegis() { return this.registroForm.controls; }
  get obtenerFormGuarSeg() { return this.guarSegmentoForm.controls; }
  get obtenerFormGuarCate() { return this.guarCategoriaForm.controls; }

  getSegmentos() {
    this.segmentoService.obtenerSegmentos().subscribe(segmentos => {
      this.listaSegmentos = segmentos;
    });
  }

  guardarSegmento() {
    if (this.validarGuardarSegmento()) {
        this.segmento.descripcion = this.obtenerFormGuarSeg.descripcionSegmento.value;
        this.segmentoService.guardarSegmento(this.segmento).subscribe(respuesta => {
          this.respuesta = respuesta;
          this.hidePopupGS();
          this.openPopupRes();
          if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
              this.indRespuesta = true;
              this.getSegmentos();
              this.inicializarComponentesGuarSeg();
          } else {
            this.indRespuesta = false;
          }
        });
    }
  }

  getDepartamentos() {
    this.departamentoService.obtenerDepartamentos().subscribe(departamentos => {
      this.listaDepartamentos = departamentos;
    });
  }

  getMunicipios() {
    this.municipioService.obtenerMunicipios(this.departamento).subscribe(departamentos => {
      this.listaMunicipios = departamentos;
    });
  }

  guardarDatosEmpresa() {
    if (this.validarGuardarRegistro()) {
        this.asignacionCampos();
        this.hidePopupConf();
        this.empresaService.gestionarEmpresa(this.gestionarEmpresaRequest).subscribe(respuesta => {
            this.respuesta = respuesta;
            this.openPopupRes();
            if (this.respuesta.tipoRespuesta === this.TIPO_RESPUESTA_OK) {
                this.indRespuesta = true;
                this.respuesta.descripcion = this.MENSAJE_GUARDADO_EXITOSAMENTE;
                this.inicializarComponentesRegistro();
            } else {
              this.indRespuesta = false;
            }
        });
    }
  }

  asignacionCampos() {
    this.gestionarEmpresaRequest.usuario.nombre =  this.obtenerFormRegis.nombreUsu.value;
    this.gestionarEmpresaRequest.usuario.password =  this.obtenerFormRegis.password.value;
    this.gestionarEmpresaRequest.usuario.codigoSegmento  = this.obtenerFormRegis.ssegmento.value;
    this.gestionarEmpresaRequest.usuario.empresa.razonSocial = this.obtenerFormRegis.razonSocial.value;
    this.gestionarEmpresaRequest.persona.primerNombre = this.obtenerFormRegis.primerNombre.value;
    this.gestionarEmpresaRequest.persona.segundoNombre = this.obtenerFormRegis.segundoNombre.value;
    this.gestionarEmpresaRequest.persona.primerApellido = this.obtenerFormRegis.primerApellido.value;
    this.gestionarEmpresaRequest.persona.segundoApellido = this.obtenerFormRegis.segundoApellido.value;
    this.gestionarEmpresaRequest.persona.documentoIdentificacion.numero = this.obtenerFormRegis.numIdentificacion.value;
    this.gestionarEmpresaRequest.persona.fecNacimiento = this.obtenerFormRegis.fecNacimiento.value;
    this.gestionarEmpresaRequest.persona.tipo.codigo =  this.TIPO_PERSONA_JURICA;
    this.gestionarEmpresaRequest.empresa.razonSocial = this.obtenerFormRegis.razonSocial.value;
    this.gestionarEmpresaRequest.empresa.nit = this.obtenerFormRegis.nit.value;
    this.gestionarEmpresaRequest.direccionElectronica.correoElectronico = this.obtenerFormRegis.direccionElectronica.value;
    this.gestionarEmpresaRequest.direccionElectronica.tipo.codigo = this.TIPO_DIRECCION_ELECTONICA;
    this.gestionarEmpresaRequest.direccion.descripcion = this.obtenerFormRegis.direccionFisica.value;
    this.gestionarEmpresaRequest.direccion.departamento.codigo = this.obtenerFormRegis.codigoDepartamento.value;
    this.gestionarEmpresaRequest.direccion.municipio.codigo = this.obtenerFormRegis.codigoMunicipio.value;
    if (this.obtenerFormRegis.numeroTelefono.value !== null && this.obtenerFormRegis.numeroTelefono.value !== '') {
        const  teleFijo: Telefono = new Telefono();
        teleFijo.numero = this.obtenerFormRegis.numeroTelefono.value;
        teleFijo.tipo.codigo = this.TIPO_TELEFONO_FIJO;
        this.gestionarEmpresaRequest.lstTelefonos.push(teleFijo);

    }
    if (this.obtenerFormRegis.numeroCelular.value !== null && this.obtenerFormRegis.numeroCelular.value !== '') {
        const  teleCelular: Telefono = new Telefono();
        teleCelular.numero = this.obtenerFormRegis.numeroCelular.value;
        teleCelular.tipo.codigo = this.TIPO_TELEFONO_CELU;
        this.gestionarEmpresaRequest.lstTelefonos.push(teleCelular);
    }
  }

  onChangeSeleccionoSegmento() {
    this.segmento.codigo = this.obtenerFormRegis.ssegmento.value;
  }

  onChangeSeleccionoDepartamento() {
    this.departamento.codigo = this.obtenerFormRegis.codigoDepartamento.value;
    this.getMunicipios();
  }

  validarGuardarSegmento(): boolean {
    this.indVisibleMessa = false;
    let indValidacionCompleta = true;
    if (this.obtenerFormGuarSeg.descripcionSegmento.value == null || this.obtenerFormGuarSeg.descripcionSegmento.value === undefined){
        this.message = 'Por favor debe ingresar la descripción segmento';
        this.indVisibleMessa = true;
        indValidacionCompleta = false;
    }

    return indValidacionCompleta;
  }

  validarGuardarRegistro(): boolean {
        this.message = '';
        this.indVisibleMessa = false;
        let indValidacionCompleta = true;
        this.message = 'Por favor debe son obligatorios los siguientes campos(';
        if (this.obtenerFormRegis.ssegmento.value == null || this.obtenerFormRegis.ssegmento.value === undefined){
            this.message = this.message + 'Segmento,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.primerNombre.value == null || this.obtenerFormRegis.primerNombre.value === undefined){
            this.message = this.message + ' Primer nombre,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.primerApellido.value == null || this.obtenerFormRegis.primerApellido.value === undefined){
            this.message = this.message + ' Primer apellido,';
            indValidacionCompleta = false;
        }
       if (this.obtenerFormRegis.numIdentificacion.value == null || this.obtenerFormRegis.numIdentificacion.value === undefined){
            this.message = this.message + ' Numero identificación,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.nombreUsu.value == null || this.obtenerFormRegis.nombreUsu.value === undefined){
            this.message = this.message + ' Nombre usuario,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.password.value == null || this.obtenerFormRegis.password.value === undefined){
            this.message = this.message + ' Contraseña,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.razonSocial.value == null || this.obtenerFormRegis.razonSocial.value === undefined){
            this.message = this.message + ' Razon social,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.nit.value == null || this.obtenerFormRegis.nit.value === undefined){
            this.message = this.message + ' Nit,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.direccionFisica.value == null || this.obtenerFormRegis.direccionFisica.value === undefined){
            this.message = this.message + ' Dirección empresa,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.codigoDepartamento.value == null || this.obtenerFormRegis.codigoDepartamento.value === undefined){
            this.message = this.message + ' Departamento,';
            indValidacionCompleta = false;
        }
        if (this.obtenerFormRegis.codigoMunicipio.value == null || this.obtenerFormRegis.codigoMunicipio.value === undefined){
            this.message = this.message + ' Municipio,';
            indValidacionCompleta = false;
        }
        if (indValidacionCompleta) {
           this.message = '';
           this.indVisibleMessa = false;
        } else {
           this.indVisibleMessa = true;
        }
    return indValidacionCompleta;
  }

  hidePopupGS() {
    this.modalgs = 'none';
  }
  openPopupGS() {
      this.modalgs = 'block';
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
     if (this.validarGuardarRegistro()) {
          this.modalconf = 'block';
     }
   }

   volverInicio() {
    this.router.navigate( ['menu']);
  }
}
