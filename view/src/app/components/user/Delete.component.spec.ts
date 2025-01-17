import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './User.service';
import { UserDelete } from './Delete.component';
import { of } from 'rxjs';

describe('UserDelete Component', () => {
  let component: UserDelete;
  let fixture: ComponentFixture<UserDelete>;
  let mockUserService: any;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockUserService = {
        get: jasmine.createSpy('get').and.returnValue(of([
          { id: 1, name: 'Tomas', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 }
        ])),
        delete: jasmine.createSpy('delete').and.returnValue(of({}))
      };
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [UserDelete],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Método delete', () => {
    it('debería llamar al servicio de borrar usuario y mostrar un mensaje de éxito', async () => {
      // Simula el usuario a borrar
      const userToDelete = {
        id: 1,
        name: 'Tomas',
        lastname: 'Garbellotto',
        dni: 12345678,
        email: 'tomas@gmail.com',
        phone: 1234567890,
      };
      
      // Configura el componente con los datos necesarios
      component.user = userToDelete; // Asegúrate de que la propiedad `user` exista y se inicialice.
      
      // Llama al método `edit`
      await component.delete();
  
      // Verifica que el servicio fue llamado con los argumentos correctos
      expect(mockUserService.delete).toHaveBeenCalledWith(userToDelete.id, userToDelete);
  
      // Verifica que se llamó a toastr con el mensaje correcto
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Usuario borrado correctamente!',
        'Success'
      );
    });
  });
});