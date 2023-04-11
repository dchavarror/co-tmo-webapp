import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceUtils } from './services.utils';
import { Unidad } from '../domain/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  endPointObtenerUnidades= '/Unidad/obtenerUnidades';
  endPointGuardarUnidad= '/Unidad/guardarUnidad';
  constructor(private servicio: ServiceUtils) { }
  obtenerUnidades(codigoCategoria: Number) {
       const query = '?codigoCat=' + codigoCategoria;
       return this.servicio.get(this.endPointObtenerUnidades , query).pipe( map( data => data ));
  }

  guardarUnidad(unidad: Unidad) {
    return this.servicio.post(this.endPointGuardarUnidad , unidad).pipe( map( data => data ));
  }
}
