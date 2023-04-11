import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceUtils } from './services.utils';
import { Departamento } from '../domain/departamento';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  endPointObtenerMunicipios = '/Municipio/obtenerMunicipios';
  constructor(private servicio: ServiceUtils) { }
  obtenerMunicipios(departamento: Departamento) {
       const query = '?codigoDep=' + departamento.codigo;
       return this.servicio.get(this.endPointObtenerMunicipios , query).pipe( map( data => data ));
  }
}