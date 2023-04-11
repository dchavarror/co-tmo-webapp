import { Respuesta } from 'src/app/domain/respuesta';
import { Usuario } from './usuario';
export class ValidarUsuarioResponse {
    respuesta: Respuesta = new  Respuesta();
    usuario: Usuario = new Usuario();
}