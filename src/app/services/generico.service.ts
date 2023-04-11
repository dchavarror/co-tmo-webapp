import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceUtils } from './services.utils';
import { TipoGenerico } from '../domain/tipoGenerico';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {
  endPointObtenerParGenerales = '/Generico/obtenerParametrosGenerales';
  constructor(private servicio: ServiceUtils) { }
  obtenerParametrosGenerales(tipo: TipoGenerico) {
    return this.servicio.post(this.endPointObtenerParGenerales , tipo).pipe( map( data => data ));
  }
}