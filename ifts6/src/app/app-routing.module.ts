import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InstitucionalComponent } from './pages/institucional/institucional.component';

const routes: Routes = [
{path:'', component: AppComponent},
{path:'institucional', component: InstitucionalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
