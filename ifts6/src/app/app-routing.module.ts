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

const routes: Routes = [
{path:'', component: InicioComponent},
{path:'institucional', component: InstitucionalComponent},
{path:'ingreso', component: IngresoComponent},
{path:'carreras', component: CarrerasComponent},
{path:'extension', component: ExtensionComponent},
{path:'convenios', component: ConveniosComponent},
{path:'contacto', component: ContactoComponent},
{path:'admin', component: AdminComponent},
{path:'admin/:id', component: AdminComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
