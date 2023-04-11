import { TipoGenerico } from './tipoGenerico';
import { Injectable } from "@angular/core";
import { Departamento } from './departamento';
import { Municipio } from './municipio';
@Injectable()
export class Direccion{
    'codigo' = 0;
    'descripcion' = '';
    'departamento'= new Departamento();
    'municipio' = new Municipio();
    'tipo' =  new TipoGenerico();
}