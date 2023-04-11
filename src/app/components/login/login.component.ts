import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../utils/autenticacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../domain/usuario';
import { ValidarUsuarioResponse } from '../../domain/validarUsuarioResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;
  message: string;
  indVisibleMessage: boolean;
  usuario: Usuario = new Usuario();
  usuarioResponse: ValidarUsuarioResponse = new ValidarUsuarioResponse();

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService) {
      this.indVisibleMessage = false;
     }

  ngOnInit() {
    this.inicializarComponentes();
  }

  inicializarComponentes() {
    this.loginForm = this.fb.group({
      username: new FormControl(),
      password:  new FormControl(),
    });
  }

  get f() { return this.loginForm.controls; }

  inciarSession() {
    if (this.validarCampos()) {
       this.usuario.nombre = this.f.username.value;
       this.usuario.password = this.f.password.value;
       this.usuarioService.validarUsuario(this.usuario).subscribe(response => {
        this.usuarioResponse = response;
        if (this.usuarioResponse.respuesta.tipoRespuesta === 'OK') {
          localStorage.setItem('indLogeado', 'true');
          localStorage.setItem('usuario', this.f.username.value);
          localStorage.setItem('nit', this.usuarioResponse.usuario.empresa.nit);
          localStorage.setItem('razonSocial',  this.usuarioResponse.usuario.empresa.razonSocial);
          localStorage.setItem('codigoSegmento',  String(this.usuarioResponse.usuario.codigoSegmento));
          this.router.navigate( ['home']);
        } else {
          this.indVisibleMessage = true;
           this.message = this.usuarioResponse.respuesta.descripcion;
        }
      });
    }
  }

  validarCampos(): boolean {
    this.indVisibleMessage = false;
    let indValidacionCompleta = false;
    if ((this.f.username.value != null && this.f.username.value !== '')
    && (this.f.password.value != null && this.f.password.value !== '')) {
        indValidacionCompleta = true;
    } else {
      this.indVisibleMessage = true;
      this.message = 'Por favor debe ingresar los datos completos';
    }

    return indValidacionCompleta;
  }

}
