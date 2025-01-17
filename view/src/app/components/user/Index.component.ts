import { Component } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { UserService } from './User.service'

@Component({
  selector: 'user-index',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Lastname</th>
                <th>Dni</th>
                <th>Email</th>
                <th>Phone</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td class="text-center">{{user.id}}</td>
                <td>{{user.name}}</td>
                <td>{{user.lastname}}</td>
                <td>{{user.dni}}</td>
                <td>{{user.email}}</td>
                <td>{{user.phone}}</td>
                <td class="text-center">
                  <a class="btn btn-secondary" routerLink="/user/{{user.id}}" title="View"><i class="fa fa-eye"></i></a>
                  <a class="btn btn-primary" routerLink="/user/edit/{{user.id}}" title="Edit"><i class="fa fa-pencil"></i></a>
                  <a class="btn btn-danger" routerLink="/user/delete/{{user.id}}" title="Delete"><i class="fa fa-times"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
          <a class="btn btn-primary" routerLink="/user/create">Create</a>
        </div>
      </div>
    </div>`
})

export class UserIndex {

  users?: any[]
  constructor(public router: Router, private UserService: UserService) { }

  ngOnInit() {
    this.get()
  }
  
  get() {
    this.UserService.get().subscribe(data => {
      this.users = data
    }, e => {
      alert(e.error)
    })
  }
}