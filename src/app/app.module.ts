import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoadingComponent } from './components/shared/loading/loading.component';

// Importar rutas
import { ROUTES } from './app.routes';
import { Producto } from './domain/producto';
import { Usuario } from './domain/usuario';
import { formatCurrency } from '@angular/common';
import { NumberFormatPipe } from './pipes/numberformat.pipe';
import { Respuesta } from './domain/respuesta';
import { DetalleProducto } from './domain/detalle.producto';
import { Venta } from './domain/venta';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { AutenticacionSave } from './utils/autenticacion.save';
import { RegistroComponent } from './components/registro/registro.component';
import { DireccionElectronica } from './domain/direccionElectronica';
import { Direccion } from './domain/direccion';
import { Telefono } from './domain/telefono';
import { Segmento } from './domain/segmento';
import { Categoria } from './domain/categoria';
import { Municipio } from './domain/municipio';
import { Departamento } from './domain/departamento';
import { GestionarEmpresaRequest } from './domain/gestionarEmpresaRequest';
import { DocumentoIdentificacion } from './domain/documentoIdentificacion';
import { Utils } from './utils/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import { MDBBootstrapModule,IconsModule } from 'angular-bootstrap-md';
import { HomeComponent } from './components/home/home.component'; 
import { Unidad } from './domain/unidad';
import { ActualizarComponent } from './components/inventarios/actualizar/actualizar.component';
import { GuardarComponent } from './components/inventarios/guardar/guardar.component';


@NgModule({
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    IconsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, relativeLinkResolution: 'legacy' })
  ],
  declarations: [
    AppComponent,
    InventariosComponent,
    GastosComponent,
    VentasComponent,
    FacturasComponent,
    InicioComponent,
    BuscarComponent,
    NavbarComponent,
    LoadingComponent,
    NumberFormatPipe,
    LoginComponent,
    MenuComponent,
    RegistroComponent,
    HomeComponent,
    ActualizarComponent,
    GuardarComponent
  ],
  providers: [Producto, Usuario, NumberFormatPipe, Respuesta, DetalleProducto, Venta, AutenticacionSave,
     DireccionElectronica, Direccion, Telefono, Segmento, Categoria, Municipio,
      Departamento, GestionarEmpresaRequest, DocumentoIdentificacion, Utils, Unidad],
  bootstrap: [AppComponent]
})
export class AppModule { }
