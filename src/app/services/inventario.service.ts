import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Producto } from '../domain/producto';
import { environment } from 'src/environments/environment';
import { ServiceUtils } from './services.utils';
import { DetalleProducto } from '../domain/detalle.producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  endPointObtenerInventario = '/Inventario/obtenerInventario';
  endPointGuardarInventario = '/Inventario/guardarInventario';
  endPointActualizarInventario = '/Inventario/actualizarInventario';
  constructor(private servicio: ServiceUtils) { }
  obtenerInventario(producto: Producto) {
       return this.servicio.post(this.endPointObtenerInventario , producto).pipe( map( data => data ));
  }

  guardarInventario(detalleProducto: DetalleProducto) {
    return this.servicio.post(this.endPointGuardarInventario , detalleProducto).pipe( map( data => data ));
  }

  actualizarInventario(detalleProducto: DetalleProducto) {
    return this.servicio.post(this.endPointActualizarInventario , detalleProducto).pipe( map( data => data ));
  }
}
