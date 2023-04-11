import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Producto } from '../domain/producto';
import { environment } from 'src/environments/environment';
import { ServiceUtils } from './services.utils';
import { Usuario } from '../domain/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  endPointValidarUsuario = '/Usuario/validarUsuario';
  constructor(private servicio: ServiceUtils) {
  }

  validarUsuario(usuario: Usuario) {
    return this.servicio.post(this.endPointValidarUsuario , usuario).pipe( map( data => data ));
  }
}
