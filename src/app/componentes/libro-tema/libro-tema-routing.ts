import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LibroTemaComponent } from "./libro-tema.component";

const LibroTemaRoutes: Routes = [
  {
    path: '',
    component: LibroTemaComponent,
  },


];

@NgModule({
  imports: [
    RouterModule.forChild(LibroTemaRoutes)
  ],
  exports: [RouterModule]
})
export class LibroTemaRoutingModule { }
