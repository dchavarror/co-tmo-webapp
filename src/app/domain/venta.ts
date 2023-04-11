import { Usuario } from './usuario';
import { Empresa } from './empresa';
import { Producto } from './producto';
import { Injectable } from "@angular/core";
@Injectable()
export class Venta {
    codigo = '';
    producto: Producto = new Producto();
    cantidad = 0;
    precioVenta = 0;
    numeroFactura = '';
    valorTotal = 0;
    usuario: Usuario = new Usuario();
    fecCreacion: '';
    fecModificacion: '';
    cantidadInventario=0;
  }