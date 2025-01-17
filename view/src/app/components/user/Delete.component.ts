import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserService } from './User.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="this.delete()">
            <div class="row">
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_id">Id</label>
                <input readonly id="user_id" name="id" class="form-control" value="{{user.id}}" type="number" required />
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_name">Name</label>
                <input readonly id="user_name" name="name" class="form-control" value="{{user.name}}" maxlength="50" />
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_lastname">Lastname</label>
                <input readonly id="user_lastname" name="lastname" class="form-control" value="{{user.lastname}}" maxlength="50" />
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_dni">Dni</label>
                <input readonly id="user_dni" name="dni" class="form-control" value="{{user.dni}}" type="number" />
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_email">Email</label>
                <input readonly id="user_email" name="email" class="form-control" value="{{user.email}}" maxlength="50" />
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_phone">Phone</label>
                <input readonly id="user_phone" name="phone" class="form-control" value="{{user.phone}}" type="number" />
              </div>
              <div class="col-12">
                <a class="btn btn-secondary" routerLink="/user">Cancel</a>
                <button class="btn btn-danger">Delete</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class UserDelete {
  
  user?: any = {}
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private UserService: UserService, 
    private toastr: ToastrService) { 
    }
  
  ngOnInit() {
    this.get()
  }

  get() {
    return this.UserService.delete(this.user.id).subscribe(data => {
      this.user = data
    }, e => {
      alert(e.error)
    })
  }

  delete() {
    this.UserService.delete(this.user.id, this.user).subscribe(() => {
      this.toastr.success('Usuario borrado correctamente!', 'Success')
      this.router.navigateByUrl('/user')
    }, (e) => {
      alert(e.error)
    })
  }
}