import { Usuario } from "./usuario";
import { Injectable } from "@angular/core";

@Injectable()
export class Unidad {
    codigo = '';
    descripcion = '';
    codigoCategoria = 0;
    usuario = new Usuario();
}