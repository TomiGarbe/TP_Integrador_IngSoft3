import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from './User.service'
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { User } from './User.model';

@Component({
  selector: 'user-create',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <form ngNativeValidate method="post" (submit)="create()">
            <div class="row">
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_name">Name</label>
                <input id="user_name" name="name" class="form-control" [(ngModel)]="user.name" />
                <span *ngIf="errors.name" class="text-danger">{{errors.name}}</span>
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_lastname">Lastname</label>
                <input id="user_lastname" name="lastname" class="form-control" [(ngModel)]="user.lastname" />
                <span *ngIf="errors.lastname" class="text-danger">{{errors.lastname}}</span>
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_dni">Dni</label>
                <input id="user_dni" name="dni" class="form-control" [(ngModel)]="user.dni" />
                <span *ngIf="errors.dni" class="text-danger">{{errors.dni}}</span>
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_email">Email</label>
                <input id="user_email" name="email" class="form-control" [(ngModel)]="user.email" />
                <span *ngIf="errors.email" class="text-danger">{{errors.email}}</span>
              </div>
              <div class="mb-3 col-md-6 col-lg-4">
                <label class="form-label" for="user_phone">Phone</label>
                <input id="user_phone" name="phone" class="form-control" [(ngModel)]="user.phone" />
                <span *ngIf="errors.phone" class="text-danger">{{errors.phone}}</span>
              </div>
              <div class="col-12">
                <a class="btn btn-secondary" routerLink="/user">Cancel</a>
                <button class="btn btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`
})
export class UserCreate {
  
  user?: any = {}
  errors?: any = {}
  constructor(
    private router: Router, 
    private UserService: UserService, 
    private toastr: ToastrService) { 
  }

  public formatName(name: string): string {
    return name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  private async userNameExists(name: string, lastname: string): Promise<boolean> {
    const users = await firstValueFrom(this.UserService.get());
    for (const user of users) {
      if (user.name === name && user.lastname === lastname) {
        return true;
      }
    }
    return false;
  }

  private async userDniPhoneExists(num: number): Promise<boolean> {
    const users = await firstValueFrom(this.UserService.get());
    for (const user of users) {
      if (user.dni === num || user.phone === num) {
        return true;
      }
    }
    return false;
  }

  private async userEmailExists(email: string): Promise<boolean> {
    const users = await firstValueFrom(this.UserService.get());
    for (const user of users) {
      if (user.email === email) {
        return true;
      }
    }
    return false;
  }

  public async userCheck(user: User): Promise<boolean> {
    if (user.name === "" || user.lastname === "" || user.dni === null || user.email === "" || user.phone === null) {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      return false;
    }

    if (await this.userNameExists(user.name, user.lastname)) {
      this.toastr.error('Ya existe un usuario con el mismo nombre y apellido.', 'Error');
      return false;
    }

    if (await this.userDniPhoneExists(user.dni)) {
      this.toastr.error('El DNI ya esta asociado a un usuario.', 'Error');
      return false;
    }

    if (await this.userEmailExists(user.email)) {
      this.toastr.error('El correo electronico ya esta asociado a un usuario.', 'Error');
      return false;
    }

    if (await this.userDniPhoneExists(user.phone)) {
      this.toastr.error('El telefono ya esta asociado a un usuario.', 'Error');
      return false;
    }

    if (user.name.length < 2 || user.lastname.length < 2) {
      this.toastr.error('El nombre/apellido debe tener como minimo 2 caracteres.', 'Error');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(user.name) || !/^[a-zA-Z\s]+$/.test(user.lastname)) {
      this.toastr.error('El nombre/apellido no puede contener numeros ni caracteres especiales.', 'Error');
      return false;
    }

    if (user.name.length > 50 || user.lastname.length > 50) {
      this.toastr.error('El nombre/apellido no puede tener mas de 50 caracteres.', 'Error');
      return false;
    }

    const dniPattern = /^[1-9]\d{6,7}$/;
    if (!dniPattern.test(user.dni.toString())) {
      this.toastr.error(
        'El DNI debe tener entre 7 y 8 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.',
        'Error'
      );
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@+(gmail|outlook|hotmail|yahoo|icloud)+.com$/;
    if (!emailPattern.test(user.email)) {
      this.toastr.error(
        'El correo electronico debe ser valido (e.g., nombre@gmail.com, usuario@outlook.com).',
        'Error'
      );
      return false;
    }

    const phonePattern = /^[1-9]\d{9}$/;
    if (!phonePattern.test(user.phone.toString())) {
      this.toastr.error(
        'El telefono debe tener exactamente 10 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.',
        'Error'
      );
      return false;
    }

    return true;
  }

  async create() {
    this.user.name = this.formatName(this.user.name);
    this.user.lastname = this.formatName(this.user.lastname);
    if (await this.userCheck(this.user)) {
      this.UserService.create(this.user).subscribe(() => {
        this.toastr.success('Usuario creado correctamente!', 'Success')
        this.router.navigateByUrl('/user')
      }, (e) => {
        alert(e.error)
      })
    }
  }
}