import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitucionalComponent } from './pages/institucional/institucional.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { CarrerasComponent } from './pages/carreras/carreras.component';
import { ExtensionComponent } from './pages/extension/extension.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ConveniosComponent } from './pages/convenios/convenios.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { Error404Component } from './components/error404/error404.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { CreditosComponent } from './pages/creditos/creditos.component';

const routes: Routes = [
{path:'', component: InicioComponent},
{path:'institucional', component: InstitucionalComponent},
{path:'ingreso', component: IngresoComponent},
{path:'carreras', component: CarrerasComponent},
{path:'extension', component: ExtensionComponent},
{path:'convenios', component: ConveniosComponent},
{path:'contacto', component: ContactoComponent},
{path:'creditos', component: CreditosComponent},
{path:'admin', component: AdminComponent},
{path:'admin/:id', component: AdminComponent},
{path:'detalle/:id', component: DetalleComponent},
{path: '**',component: Error404Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
