import { TipoGenerico } from './tipoGenerico';
import { Injectable } from "@angular/core";
@Injectable()
export class Telefono {
   'codigo' = 0;
   'numero' = '';
    'tipo' = new TipoGenerico();
}