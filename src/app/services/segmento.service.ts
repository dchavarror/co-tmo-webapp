import { Injectable } from '@angular/core';
import { ServiceUtils } from './services.utils';
import { map } from 'rxjs/operators';
import { Segmento } from '../domain/segmento';


@Injectable({
    providedIn: 'root'
  })

  export class SegmentoService {
    endPointObtenerSegmentos = '/Segmento/obtenerSegmentos';
    endPointGuardarSegmento = '/Segmento/guardarSegmento';
    constructor(private servicio: ServiceUtils) { }
    obtenerSegmentos() {
         return this.servicio.get(this.endPointObtenerSegmentos , '').pipe( map( data => data ));
    }
    guardarSegmento(segmento: Segmento) {
      return this.servicio.post(this.endPointGuardarSegmento , segmento).pipe( map( data => data ));
    }
  }