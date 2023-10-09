import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { InstitucionalComponent } from './pages/institucional/institucional.component';
import { CarrerasComponent } from './pages/carreras/carreras.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { ExtensionComponent } from './pages/extension/extension.component';
import { ConveniosComponent } from './pages/convenios/convenios.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    InstitucionalComponent,
    CarrerasComponent,
    IngresoComponent,
    ExtensionComponent,
    ConveniosComponent,
    ContactoComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
