import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Producto } from '../domain/producto';
import { environment } from 'src/environments/environment';
import { ServiceUtils } from './services.utils';
import { Venta } from '../domain/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  endPointObtenerVenta = '/Venta/obtenerVentas';
  endPointGuardarVenta = '/Venta/guardarVenta';
  constructor(private servicio: ServiceUtils) { }
  obtenerVenta(producto: Producto) {
       return this.servicio.post(this.endPointObtenerVenta , producto).pipe( map( data => data ));
  }

  guardarVentas(listaVentas: Venta[], indAplicaFactura: Boolean, nombreCliente: string, paganCon: number) {
    const query = '?indAplicaFactura=' + indAplicaFactura + '&nombreCliente=' + nombreCliente + '&paganCon=' + paganCon;
    return this.servicio.post(this.endPointGuardarVenta + query, listaVentas).pipe( map( data => data ));
  }
}
