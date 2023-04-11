import { Empresa } from './empresa';
import { Usuario } from './usuario';
import { TipoGenerico } from './tipoGenerico';
import { Injectable } from "@angular/core";
@Injectable()
export class Producto {
  codigo = 0;
  descripcion = '';
  codigoBarras = '';
  codigoCategoria = 0;
  usuario: Usuario = new Usuario();
  fecInicio: '';
  fecFin: '';
  tipoUnidad: TipoGenerico  = new TipoGenerico();
}