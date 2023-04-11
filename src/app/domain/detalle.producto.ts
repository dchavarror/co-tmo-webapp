import { Usuario } from './usuario';
import { Empresa } from './empresa';
import { Producto } from './producto';
import { TipoGenerico } from './tipoGenerico';
import { Injectable } from "@angular/core";
@Injectable()
export class DetalleProducto {
    codigo = '';
    precioUnitario = 0;
    capacidad = '';
    producto: Producto = new Producto();
    cantidad = 0;
    porcentajeGanancia = 0;
    precioFinal = 0;
    usuario: Usuario = new Usuario();
    fecCreacion: '';
    fecModificacion: '';
    tipoUnidad: TipoGenerico = new TipoGenerico();
    codigoBarras: '';
  }