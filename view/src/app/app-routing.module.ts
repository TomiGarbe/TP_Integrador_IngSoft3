import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserIndex } from './components/user/Index.component'
import { UserCreate } from './components/user/Create.component'
import { UserEdit } from './components/user/Edit.component'
import { UserDelete } from './components/user/Delete.component'

const routes: Routes = [
  { path: 'user', component: UserIndex },
  { path: 'user/create', component: UserCreate },
  { path: 'user/edit/:id', component: UserEdit },
  { path: 'user/delete/:id', component: UserDelete },
  { path: '**', redirectTo: 'user', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }