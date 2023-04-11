import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceUtils } from './services.utils';
import { Categoria } from '../domain/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  endPointObtenerCategorias = '/Categoria/obtenerCategorias';
  endPointGuardarCategoria = '/Categoria/guardarCategoria';
  constructor(private servicio: ServiceUtils) { }
  obtenerCategorias(codigoSegmento: Number) {
       const query = '?codigoSeg=' + codigoSegmento;
       return this.servicio.get(this.endPointObtenerCategorias , query).pipe( map( data => data ));
  }

  guardarCategoria(categoria: Categoria) {
    return this.servicio.post(this.endPointGuardarCategoria , categoria).pipe( map( data => data ));
  }
}
