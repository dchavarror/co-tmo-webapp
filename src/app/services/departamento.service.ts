import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceUtils } from './services.utils';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  endPointObtenerDepartamentos = '/Departamento/obtenerDepartamentos';
  constructor(private servicio: ServiceUtils) { }
  obtenerDepartamentos() {
       return this.servicio.get(this.endPointObtenerDepartamentos , '').pipe( map( data => data ));
  }
}