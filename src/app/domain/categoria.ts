import { Usuario } from "./usuario";
import { Injectable } from "@angular/core";

@Injectable()
export class Categoria {
    codigo = 0;
    descripcion = '';
    codigoSegmento = 0;
    usuario = new Usuario();
}