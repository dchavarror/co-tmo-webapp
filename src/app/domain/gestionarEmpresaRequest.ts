import { Empresa } from './empresa';
import { Persona } from './persona';
import { Direccion } from './direccion';
import { DireccionElectronica } from './direccionElectronica';
import { Telefono } from './telefono';
import { Usuario } from './usuario';
import { Injectable } from "@angular/core";
@Injectable()
export class GestionarEmpresaRequest {
    empresa = new Empresa();
    persona = new Persona();
    direccion = new Direccion();
    direccionElectronica = new DireccionElectronica();
    lstTelefonos: Telefono[] = [];
    usuario = new Usuario();
  }