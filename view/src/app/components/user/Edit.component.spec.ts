import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './User.service';
import { UserEdit } from './Edit.component';
import { of } from 'rxjs';

describe('UserEdit Component', () => {
  let component: UserEdit;
  let fixture: ComponentFixture<UserEdit>;
  let mockUserService: any;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockUserService = {
        get: jasmine.createSpy('get').and.returnValue(of([
          { id: 1, name: 'Tomas', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 }
        ])),
        edit: jasmine.createSpy('edit').and.returnValue(of({}))
      };
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [UserEdit],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Método formatName', () => {
    it('debería formatear correctamente un nombre', () => {
      const result = component.formatName('tOmAs');
      expect(result).toBe('Tomas');
    });
  });

  describe('Método userCheck', () => {
    beforeEach(() => {
      mockUserService.get.and.returnValue(of([{ id: 1, name: 'Tomas', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 }]));
    });

    it('debería retornar false si algún campo está vacío', async () => {
      const invalidUser = { id: 2, name: '', lastname: '', dni: 0, email: '', phone: 0 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('Todos los campos son requeridos', 'Error');
    });

    it('debería retornar false si ya existe un usuario con el mismo nombre y apellido', async () => {
      const invalidUser = { id: 2, name: 'Tomas', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('Ya existe un usuario con el mismo nombre y apellido.', 'Error');
    });

    it('debería retornar false si ya existe un usuario con el mismo dni', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El DNI ya esta asociado a un usuario.', 'Error');
    });

    it('debería retornar false si ya existe un usuario con el mismo correo electronico', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomas@gmail.com', phone: 1234567890 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El correo electronico ya esta asociado a un usuario.', 'Error');
    });

    it('debería retornar false si ya existe un usuario con el mismo telefono', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomi@gmail.com', phone: 1234567890 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El telefono ya esta asociado a un usuario.', 'Error');
    });

    it('debería retornar false si el nombre o apellido tiene menos de 2 caracteres', async () => {
      const invalidUser = { id: 2, name: 'T', lastname: 'G', dni: 87654321, email: 'tomi@gmail.com', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El nombre/apellido debe tener como minimo 2 caracteres.', 'Error');
    });

    it('debería retornar false si el nombre o apellido tiene numeros o caracteres especiales', async () => {
      const invalidUser = { id: 2, name: 'Tomi123', lastname: 'Garbellotto!', dni: 87654321, email: 'tomi@gmail.com', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El nombre/apellido no puede contener numeros ni caracteres especiales.', 'Error');
    });

    it('debería retornar false si el nombre o apellido tiene mas de 50 caracteres', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', dni: 87654321, email: 'tomi@gmail.com', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El nombre/apellido no puede tener mas de 50 caracteres.', 'Error');
    });

    it('debería retornar false si el dni tiene menos de 7 numeros', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 654321, email: 'tomi@gmail.com', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El DNI debe tener entre 7 y 8 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.', 'Error');
    });

    it('debería retornar false si el dni tiene mas de 8 numeros', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 987654321, email: 'tomi@gmail.com', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El DNI debe tener entre 7 y 8 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.', 'Error');
    });

    it('debería retornar false si el formato del correo electronico no es valido', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomi@abc', phone: 9876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El correo electronico debe ser valido (e.g., nombre@gmail.com, usuario@outlook.com).', 'Error');
    });

    it('debería retornar false si el telefono tiene menos de 10 numeros', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomi@gmail.com', phone: 876543210 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El telefono debe tener exactamente 10 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.', 'Error');
    });

    it('debería retornar false si el telefono tiene mas de 10 numeros', async () => {
      const invalidUser = { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomi@gmail.com', phone: 98765432100 };
      const result = await component.userCheck(invalidUser);
      expect(result).toBeFalse();
      expect(mockToastrService.error).toHaveBeenCalledWith('El telefono debe tener exactamente 10 numeros, no puede comenzar con 0 y no puede contener letras ni caracteres especiales.', 'Error');
    });

    it('debería retornar true para un usuario válido', async () => {
      const validUser = {
        id: 2,
        name: 'Tomi',
        lastname: 'Garbe',
        dni: 87654321,
        email: 'tomi@gmail.com',
        phone: 9876543210,
      };
      const result = await component.userCheck(validUser);
      expect(result).toBeTrue();
    });
  });

  describe('Método edit', () => {
    it('debería llamar al servicio de edicion y mostrar un mensaje de éxito', async () => {
      // Simula el usuario editado
      const userToEdit = {
        id: 1,
        name: 'Tomas',
        lastname: 'Garbellotto',
        dni: 12345678,
        email: 'tomas@gmail.com',
        phone: 1234567890,
      };
      
      // Configura el componente con los datos necesarios
      component.user = userToEdit; // Asegúrate de que la propiedad `user` exista y se inicialice.
      
      // Espía el método userCheck para que devuelva true
      spyOn(component, 'userCheck').and.returnValue(Promise.resolve(true));
      
      // Llama al método `edit`
      await component.edit();
  
      // Verifica que el servicio fue llamado con los argumentos correctos
      expect(mockUserService.edit).toHaveBeenCalledWith(userToEdit.id, userToEdit);
  
      // Verifica que se llamó a toastr con el mensaje correcto
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Usuario editado correctamente!',
        'Success'
      );
    });
  });
});