import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Producto } from '../domain/producto';
import { environment } from 'src/environments/environment';
import { ServiceUtils } from './services.utils';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
   endPointObtenerProducto = '/Producto/obtenerProductos';
   endPointGuardarProducto = '/Producto/guardarProducto';

  constructor(private servicio: ServiceUtils) { }
  obtenerProducto(producto: Producto) {
       return this.servicio.post(this.endPointObtenerProducto , producto).pipe( map( data => data ));
  }

  guardarProducto(producto: Producto) {
    return this.servicio.post(this.endPointGuardarProducto , producto).pipe( map( data => data ));
  }
}
