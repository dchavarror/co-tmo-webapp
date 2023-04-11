import { TipoGenerico } from '../domain/tipoGenerico';
import { Injectable } from "@angular/core";
@Injectable()
export class DocumentoIdentificacion {
    numero = '';
    tipo = new TipoGenerico();
}