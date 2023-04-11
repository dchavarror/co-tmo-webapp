import { Usuario } from './usuario';
import { Injectable } from "@angular/core";
@Injectable()
export class Segmento{
    'codigo': number;
    'descripcion' = '';
    'usuario' = new Usuario();
}