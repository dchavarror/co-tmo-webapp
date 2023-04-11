import { TipoGenerico } from './tipoGenerico';
import { Injectable } from "@angular/core";
@Injectable()
export class DireccionElectronica{
    'codigo' = 0;
    'correoElectronico' = '';
    'tipo' = new TipoGenerico();
}