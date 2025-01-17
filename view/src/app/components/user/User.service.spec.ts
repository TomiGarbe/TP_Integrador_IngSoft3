import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './User.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('debería obtener un usuario por ID', () => {
      const mockUser = { id: 1, name: 'Usuario' };

      service.get(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser); // Simula la respuesta de la API
    });

    it('debería obtener todos los usuarios si no se proporciona ID', () => {
      const mockUsers = [{ id: 1, name: 'Usuario1' }, { id: 2, name: 'Usuario2' }];

      service.get().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('/users' + location.search);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('create', () => {
    it('debería crear un usuario con datos proporcionados', () => {
      const mockData = { name: 'Usuario' };
      const mockResponse = { id: 1, ...mockData };

      service.create(mockData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });

    it('debería obtener la ruta de creación de usuarios si no se proporcionan datos', () => {
      const mockResponse = 'Formulario de creación';

      service.create().subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne('/users/create');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('edit', () => {
    it('debería editar un usuario con datos proporcionados', () => {
      const mockData = { name: 'Usuario Actualizado' };
      const id = 1;

      service.edit(id, mockData).subscribe((response) => {
        expect(response).toEqual(mockData);
      });

      const req = httpMock.expectOne(`/users/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockData);
    });

    it('debería obtener un usuario por ID para editar si no se proporcionan datos', () => {
      const mockUser = { id: 1, name: 'Usuario' };

      service.edit(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('delete', () => {
    it('debería eliminar un usuario con datos proporcionados', () => {
      const id = 1;
      const mockResponse = { confirmation: true };
  
      service.delete(id, { someData: true }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
  
      const req = httpMock.expectOne(`/users/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('debería obtener un usuario por ID para eliminar si no se proporcionan datos', () => {
      const mockUser = { id: 1, name: 'Usuario' };

      service.delete(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });
});
