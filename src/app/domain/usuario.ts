import { Empresa } from './empresa';
import { Rol } from './rol';
import { Injectable } from "@angular/core";
@Injectable()
export class Usuario {
  nombre = '';
  password: '';
  empresa: Empresa = new Empresa();
  rol: Rol = new Rol();
  codigoSegmento: number;
}