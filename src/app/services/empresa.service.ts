import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceUtils } from './services.utils';
import { GestionarEmpresaRequest } from '../domain/gestionarEmpresaRequest';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
   endPointGestionarEmpresa = '/Empresa/gestionarEmpresa';

  constructor(private servicio: ServiceUtils) { }

  gestionarEmpresa(gestionarEmpresaRequest: GestionarEmpresaRequest) {
    return this.servicio.post(this.endPointGestionarEmpresa , gestionarEmpresaRequest).pipe( map( data => data ));
  }
}
