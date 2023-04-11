import { DocumentoIdentificacion } from './documentoIdentificacion';
import { Usuario } from './usuario';
import { TipoGenerico } from './tipoGenerico';
export class Persona {
    codigo = 0;
    primerNombre = '';
    segundoNombre = '';
    primerApellido = '';
    segundoApellido = '';
    fecNacimiento = '';
    documentoIdentificacion = new DocumentoIdentificacion();
    usuario = new Usuario();
    tipo = new TipoGenerico();
}