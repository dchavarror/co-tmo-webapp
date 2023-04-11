import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { AutenticacionSave } from './utils/autenticacion.save';
import { RegistroComponent } from './components/registro/registro.component';

export const ROUTES: Routes = [
    { path: 'home', component: InicioComponent , canActivate: [AutenticacionSave]},
    { path: 'buscar', component: BuscarComponent , canActivate: [AutenticacionSave]},
    { path: 'inventarios', component: InventariosComponent , canActivate: [AutenticacionSave]},
    { path: 'ventas', component: VentasComponent , canActivate: [AutenticacionSave]},
    { path: 'gastos', component: GastosComponent , canActivate: [AutenticacionSave]},
    { path: 'login', component: LoginComponent },
    { path: 'menu', component: MenuComponent},
    { path: 'registro', component: RegistroComponent},
    { path: '', pathMatch: 'full', redirectTo: 'menu'},
    { path: '**', pathMatch: 'full', redirectTo: 'menu'}
];